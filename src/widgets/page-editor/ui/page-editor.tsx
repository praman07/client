import '@blocknote/shadcn/style.css'
import './editor.css'
import { reset as resetLinkify } from 'linkifyjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SuggestionMenuController, useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { usePageSync } from '../hooks/use-page-sync'
import { NotionSlashMenu } from './notion-slash-menu'
import { PageEditorSkeleton } from './page-editor-skeleton'
import { PageTitle } from './page-title'
import { LockedBanner } from './locked-banner'
import { CollaboratorBar } from './collaborator-bar'
import { PageCoverBanner } from './page-cover'
import { PageEmojiPicker } from './page-emoji'
import type * as Y from 'yjs'
import type { PageAwarenessProvider } from '@/entities/page-session'
import { assignColor } from '@/entities/page-presence'
import { useAppSelector, useAuth, useUser } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { createLogger } from '@/shared/lib/logger'
import {
  registerPageAwarenessProvider,
  unregisterPageAwarenessProvider,
} from '@/features/pages/events'
import {
  createBlockNoteUploadAdapter,
  extractActiveFileIds,
  migrateDocumentUrls,
} from '@/shared/lib/blocknote'
import { VaultFileSource, markFilesUnreferenced } from '@/shared/api/vault'
import { usePageById } from '@/entities/page'
import { mentionSchema, MentionMenuController, useSyncMentions } from '@/features/mention'

const log = createLogger('pages:page-editor')

interface PageEditorProps {
  pageId: string
}

/**
 * PageEditor — two-layer orchestrator.
 *
 * System Design Decision: Synchronous Hydration Enforcement
 *   Layer 1 orchestrates `usePageSync` (Y.Doc + AwarenessProvider) and blocks Layer 2 rendering
 *   until `serverSynced=true`. This guarantees BlockNote's initial read of the "blocknote"
 *   XmlFragment happens strictly after server state is fully merged, avoiding race conditions.
 *
 * @layer Widgets
 */
export function PageEditor({ pageId }: PageEditorProps) {
  const { ydoc, awarenessProvider, serverSynced, isLocked } =
    usePageSync(pageId)
  // System Design Decision: Propagate `project` explicitly to guarantee upload capabilities are initialized before BlockNote mounts.
  const project = useAppSelector(selectCurrentProject)

  log.debug('Render', { pageId, serverSynced, isLocked, projectId: project?.id })

  if (!serverSynced) return <PageEditorSkeleton />
  // // TODO (Architecture): Centralize project context initialization higher in the component tree to eliminate this check.
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
  // System Design Decision: Linkify Initialization Reset
  // We use lazy state initialization to globally reset `linkifyjs` precisely once per mount.
  // Without this, switching pages causes BlockNote to emit "already initialized" errors for URL schemes.
  // // TODO (UX): Consider moving this global reset into a centralized Page transition wrapper component.
  useState(() => {
    resetLinkify()
  })

  const { user: currentUser } = useUser()
  const { getToken } = useAuth()

  // System Design Decision: Decoupled Awareness Registration
  // We explicitly register the singleton provider within the component lifecycle
  // to ensure remote cursor updates aren't dropped. React `key={pageId}` enforces a clean remount per page.
  useEffect(() => {
    registerPageAwarenessProvider(pageId, awarenessProvider)
    return () => {
      unregisterPageAwarenessProvider(pageId)
    }
  }, [pageId, awarenessProvider])

  const currentPage = usePageById(pageId, project.id)
  const coverUrl = currentPage?.coverUrl ?? null
  const icon = currentPage?.icon ?? null
  const dbTitle = currentPage?.title ?? ''

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
  // System Design Decision: Stable reference for upload capability. Must be declared before `useCreateBlockNote`.
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
    schema: mentionSchema,
    collaboration: {
      // System Design Decision: We strictly map to the "blocknote" XmlFragment. Using other identifiers (e.g. "default") prevents proper BlockNote hydration.
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

  // ── One-time migration (legacy vault:// or amazonaws URLs) ─────────────
  // System Design Decision: Client-Side Content Hydration
  // A one-time URL migration is bundled here to convert legacy `vault://` or `amazonaws` formats into permanent proxy URLs across the CRDT.
  // // TODO (Architecture): Abstract legacy URL migration into a centralized DB migration worker rather than imposing read-time penalty.
  useEffect(() => {
    migrateDocumentUrls(editor)
    // Seed savedFileIdsRef after migration so the deletion tracker starts clean
    savedFileIdsRef.current = extractActiveFileIds(editor.document)
    log.debug('[SNAPSHOT_SEEDED]', {
      pageId,
      fileIds: [...savedFileIdsRef.current],
      count: savedFileIdsRef.current.size,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  // once per mount — editor is stable

  // ── Vault unreferenced tracking — debounced save signal ─────────────────
  // System Design Decision: Editor State Propagation & Orphan Cleanup
  // We orchestrate orphan tracking through a 5-second debounced `onChange` subscription.
  // This acts as a pseudo "save" checkpoint for tracking unreferenced files, allowing
  // the server S3 cleanup job to confidently mark assets for deletion.
  const savedFileIdsRef = useRef<Set<string>>(new Set())

  // ── Mention sync ─────────────────────────────────────────────────────────
  // Debounced onChange → extract chips → createMentions / deleteMentionsBySource
  const syncMentions = useSyncMentions({
    sourceEntityId:   pageId,
    sourceEntityType: 'PAGE',
    editor,
  })

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    const unsubscribe = editor.onChange(() => {
      if (debounceTimer) clearTimeout(debounceTimer)

      // File unreferenced tracking (5s debounce)
      debounceTimer = setTimeout(async () => {
        const currentIds = extractActiveFileIds(editor.document)
        const removed = [...savedFileIdsRef.current].filter(
          (id) => !currentIds.has(id),
        )

        savedFileIdsRef.current = currentIds

        log.info('[UNREF_DIFF]', {
          pageId,
          currentIds: [...currentIds],
          removedIds: removed,
          hasRemovals: removed.length > 0,
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
          log.warn('[UNREF_MARK_FAILED]', { err, removedIds: removed, pageId })
        }
      }, 5_000)

      // Mention sync (1.5s debounce — handled internally by useSyncMentions)
      syncMentions()
    })

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, pageId, syncMentions])

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Full-width cover banner — outside max-w-3xl */}
      <PageCoverBanner coverUrl={coverUrl} />

      <div className="mx-auto w-full max-w-3xl px-16 pt-6 pb-12">
        {/* Emoji — overlaps cover bottom edge if cover exists */}
        <PageEmojiPicker icon={icon} hasCover={!!coverUrl} isLocked={isLocked} />

        <CollaboratorBar />

        <PageTitle ydoc={ydoc} isLocked={isLocked} dbTitle={dbTitle} />

        {isLocked && <LockedBanner />}

        {/* System Design Decision: uploadFile injects directly into the editor instance constructor, not the UI view component. */}
        <BlockNoteView editor={editor} editable={!isLocked} slashMenu={false}>
          <SuggestionMenuController
            triggerCharacter="/"
            suggestionMenuComponent={NotionSlashMenu}
          />
          {/* @-mention suggestion menu — backed by TanStack entity cache */}
          <MentionMenuController projectId={project.id} />
        </BlockNoteView>
      </div>
    </div>
  )
}
