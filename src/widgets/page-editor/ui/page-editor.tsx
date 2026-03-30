import '@blocknote/shadcn/style.css'
import { reset as resetLinkify } from 'linkifyjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { usePageSync } from '../hooks/use-page-sync'
import { PageEditorSkeleton } from './page-editor-skeleton'
import { PageTitle } from './page-title'
import { LockedBanner } from './locked-banner'
import { CollaboratorBar } from './collaborator-bar'
import type * as Y from 'yjs'
import type { PageAwarenessProvider } from '@/entities/page-session'
import { assignColor } from '@/entities/page-presence'
import { useAppSelector, useAuth } from '@/shared/hooks'
import { selectCurrentUser } from '@/entities/user'
import { selectCurrentProject } from '@/entities/project'
import { createLogger } from '@/shared/lib/logger'
import {
  registerPageAwarenessProvider,
  unregisterPageAwarenessProvider,
} from '@/features/pages/events'
import {
  createBlockNoteUploadAdapter,
  extractVaultFileIds,
  extractTrackedFileIds,
  refreshVaultUrls,
} from '@/shared/lib/blocknote'
import { markFilesUnreferenced, VaultFileSource } from '@/shared/api/vault'

const log = createLogger('pages:page-editor')

interface PageEditorProps {
  pageId: string
}

/**
 * PageEditor — two-layer orchestrator.
 *
 * Layer 1: runs usePageSync (Phases 1–4) — owns Y.Doc + AwarenessProvider.
 * Layer 2: PageEditorBody — only mounts after serverSynced=true, so BlockNote
 *          reads the fragment only after server data has been applied.
 *
 * @layer Widgets
 */
export function PageEditor({ pageId }: PageEditorProps) {
  const { ydoc, awarenessProvider, serverSynced, isLocked } =
    usePageSync(pageId)
  // Read project here so we can guard before rendering PageEditorBody.
  // PageEditorBody needs project at mount-time for useCreateBlockNote({ uploadFile }).
  const project = useAppSelector(selectCurrentProject)

  log.debug('Render', { pageId, serverSynced, isLocked, projectId: project?.id })

  if (!serverSynced) return <PageEditorSkeleton />
  // If project somehow isn't in Redux yet (route guard edge case), show skeleton.
  // PageEditorBody requires project to be defined at mount time.
  if (!project?.id) {
    log.warn('PageEditor — project not resolved yet, showing skeleton')
    return <PageEditorSkeleton />
  }

  return (
    <PageEditorBody
      pageId={pageId}
      project={project}
      ydoc={ydoc}
      awarenessProvider={awarenessProvider}
      isLocked={isLocked}
    />
  )
}

// ─── PageEditorBody ───────────────────────────────────────────────────────────
// Only mounts when serverSynced=true — guarantees the Y.Doc has server content
// before BlockNote reads its "blocknote" XmlFragment.

interface PageEditorBodyProps {
  pageId: string
  project: NonNullable<ReturnType<typeof selectCurrentProject>>
  ydoc: Y.Doc
  awarenessProvider: PageAwarenessProvider
  isLocked: boolean
}

function PageEditorBody({
  pageId,
  project,
  ydoc,
  awarenessProvider,
  isLocked,
}: PageEditorBodyProps) {
  // Reset linkifyjs before each mount so BlockNote can re-register all schemes
  // (http, https, ftp, mailto, tel...) without 'already initialized' warnings.
  // Using lazy component state initialization to run only once per mount.
  useState(() => {
    resetLinkify()
  })

  const currentUser = useAppSelector(selectCurrentUser)
  const { getToken } = useAuth()

  // Register the awareness provider so incoming remote cursor packets can be
  // applied to the Yjs awareness state. Without this the awarenessRegistry Map
  // stays empty and all remote cursors are silently dropped.
  // Runs once per mount (PageEditorBody remounts via key={pageId} on page switch).
  useEffect(() => {
    registerPageAwarenessProvider(pageId, awarenessProvider)
    return () => {
      unregisterPageAwarenessProvider(pageId)
    }
  }, [pageId, awarenessProvider])

  const currentUserId = currentUser?.id ?? null
  const userColor = useMemo(
    () => (currentUserId ? assignColor(currentUserId) : '#6366f1'),
    [currentUserId],
  )

  log.debug('PageEditorBody mount — binding BlockNote to ydoc fragment', {
    isLocked,
    userId: currentUser?.id,
    projectId: project.id,   // always defined — guarded in parent PageEditor
  })

  // ── Vault upload adapter ────────────────────────────────────────────────────
  // project is guaranteed non-null here (guarded in parent PageEditor).
  // Declared before useCreateBlockNote so the editor is created with uploadFile set.
  const uploadAdapter = useMemo(
    () =>
      createBlockNoteUploadAdapter({
        workspaceId: project.workspaceId,
        projectId: project.id,
        source: 'PAGE',
        sourceId: pageId,
        getToken,
      }),
    [project.id, project.workspaceId, pageId, getToken],
  )

  const editor = useCreateBlockNote({
    collaboration: {
      // BlockNote reads/writes to the "blocknote" XmlFragment internally.
      // MUST match this name — "content" or "default" will produce an empty editor.
      fragment: ydoc.getXmlFragment('blocknote'),
      provider: {
        // Passes our Yjs Awareness instance for real-time cursor positions
        awareness: awarenessProvider.awareness,
      },
      user: {
        name: currentUser?.fullName ?? 'Anonymous',
        color: userColor,
      },
      showCursorLabels: 'activity',
    },
    // uploadFile is an editor-level capability — it lives on the editor instance,
    // not on BlockNoteView. Passed here so the editor carries it internally.
    uploadFile: uploadAdapter,
  })

  // ── Vault URL refresh — mount + post-upload ──────────────────────────────
  // 1. On mount: resolve any vault:// refs stored in the YJS doc from previous
  //    sessions. Safe because PageEditorBody only mounts after serverSynced=true.
  // 2. editor.onChange subscription: resolve vault:// refs immediately after each
  //    upload so the image is visible without a page reload. uploadFile returns
  //    `vault://fileId`; BlockNote writes it to the block; onChange fires; we
  //    resolve it here in the same event loop tick.
  // blockFileMap: Map<blockId, fileId> — populated by refreshVaultUrls BEFORE
  // it replaces vault://fileId with presigned URLs in the YJS doc. This lets
  // extractTrackedFileIds detect deletions by blockId presence, not URL scheme.
  const blockFileMapRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    void refreshVaultUrls(editor, getToken, blockFileMapRef.current)

    const unsubscribe = editor.onChange(() => {
      const hasVaultUrl = (editor.document as Array<any>).some(
        (b: any) =>
          typeof b.props?.url === 'string' && b.props.url.startsWith('vault://'),
      )
      if (hasVaultUrl) void refreshVaultUrls(editor, getToken, blockFileMapRef.current)
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])   // run once per editor instance; editor.onChange is stable

  // ── Vault unreferenced tracking — debounced save signal ───────────────────
  // Pages have no explicit Save button — YJS syncs continuously. We treat a
  // 5-second quiet period (no further editor changes) as the "save" checkpoint.
  //
  // On each quiet-period trigger:
  //   1. Extract current vault fileIds from the live document
  //   2. Diff vs the previous saved snapshot (savedFileIdsRef)
  //   3. For any removed fileIds → call markFilesUnreferenced (fire-and-forget)
  //   4. Update savedFileIdsRef to the current snapshot
  //
  // This is the only server call on content change. It never blocks the editor.
  const savedFileIdsRef = useRef<Set<string>>(new Set())

  // Seed savedFileIdsRef once on mount.
  // extractVaultFileIds catches any vault:// refs still in the YJS doc
  // (before refreshVaultUrls runs). For docs where vault:// was already
  // replaced in a prior session, this returns empty — that is OK because
  // blockFileMapRef will be populated by the first refreshVaultUrls call.
  useEffect(() => {
    const initialIds = extractVaultFileIds(editor.document)
    savedFileIdsRef.current = initialIds
    log.debug('[SNAPSHOT_SEEDED]', {
      pageId,
      fileIds: [...initialIds],
      count: initialIds.size,
      note: initialIds.size === 0 ? 'doc has presigned URLs — will populate via blockFileMap on first refresh' : 'vault:// refs found at mount',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  // intentionally once; editor.document is populated at mount

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    const unsubscribe = editor.onChange(() => {
      if (debounceTimer) clearTimeout(debounceTimer)

      debounceTimer = setTimeout(async () => {
        // Use blockFileMapRef (populated by refreshVaultUrls with blockId→fileId
        // entries) to detect removals by blockId presence. This works even after
        // refreshVaultUrls has replaced vault:// refs with presigned URLs in the
        // YJS doc. Falls back to vault:// scanning when map is empty (no uploads
        // have happened in this session yet).
        const trackedIds = extractTrackedFileIds(editor.document, blockFileMapRef.current)
        const currentIds = trackedIds.size > 0 || blockFileMapRef.current.size > 0
          ? trackedIds
          : extractVaultFileIds(editor.document)

        const removed = [...savedFileIdsRef.current].filter(
          (id) => !currentIds.has(id),
        )

        // Update snapshot — always reflects the latest tracked state.
        savedFileIdsRef.current = currentIds

        log.info('[UNREF_DIFF]', {
          pageId,
          currentIds: [...currentIds],
          removedIds: removed,
          hasRemovals: removed.length > 0,
          blockFileMapSize: blockFileMapRef.current.size,
        })

        if (removed.length === 0) return

        const token = await getToken()
        if (!token) return

        try {
          await markFilesUnreferenced(removed, pageId, VaultFileSource.Page, token)
          log.info('[FILE_MARKED_UNREFERENCED]', {
            pageId,
            removedIds: removed,
            markedCount: removed.length,
          })
        } catch (err) {
          // Fire-and-forget: failure leaves files as ACTIVE orphans.
          // Not critical — no data loss. Cleanup job won't delete them.
          log.warn('[UNREF_MARK_FAILED]', { err, removedIds: removed, pageId })
        }
      }, 5_000)  // 5-second quiet period
    })

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, pageId])  // stable refs; pageId is stable per PageEditorBody mount

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="mx-auto w-full max-w-3xl px-2 py-12">
        <CollaboratorBar />

        {/* <PageCover ydoc={ydoc} /> */}

        <PageTitle ydoc={ydoc} isLocked={isLocked} />

        {isLocked && <LockedBanner />}

        {/* uploadFile is NOT a prop on BlockNoteView — it lives on the editor instance */}
        <BlockNoteView editor={editor} theme="light" editable={!isLocked} />
      </div>
    </div>
  )
}
