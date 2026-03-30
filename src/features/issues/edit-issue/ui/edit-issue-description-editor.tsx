/**
 * EditIssueDescriptionEditor — BlockNote editor for the edit-issue modal.
 *
 * Unlike the create-issue editor, this one:
 *   - Loads initial content from S3 (via useGetIssueDescription)
 *   - Calls onDescriptionLoaded(blocks) once after initial S3 load
 *     so the parent can seed its `originalBlocks` baseline for dirty tracking
 *   - Has formattingToolbar enabled (users edit full content in this view)
 *   - Still disables the sideMenu for a cleaner look inside the modal
 *
 * Props:
 *   issueId            — used to fetch the description URL
 *   descriptionS3Key   — if null → skip S3 fetch, show placeholder
 *   onChange           — fires on every editor content change
 *   onDescriptionLoaded — fires once when S3 content is loaded into editor
 *   editable           — false while saving
 *
 * @layer Features
 */
import '@blocknote/shadcn/style.css'
import { useEffect, useRef } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { en } from '@blocknote/core/locales'
import { useGetIssueDescription } from '../hooks/use-get-issue-description'
import type { BlockNoteEditor } from '@blocknote/core'
import { useAppSelector, useAuth } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import {
  createBlockNoteUploadAdapter,
  extractVaultFileIds,
  extractTrackedFileIds,
  refreshVaultUrls,
} from '@/shared/lib/blocknote'
import { markFilesUnreferenced, VaultFileSource } from '@/shared/api/vault'
import { createLogger } from '@/shared/lib/logger'

interface EditIssueDescriptionEditorProps {
  issueId: string
  descriptionS3Key: string | null
   
  onChange: (blocks: Array<any>) => void
   
  onDescriptionLoaded: (blocks: Array<any>) => void
   
  editorRef?: React.MutableRefObject<BlockNoteEditor<any> | null>
  editable?: boolean
}

const log = createLogger('issues:edit-issue-description-editor')

export function EditIssueDescriptionEditor({
  issueId,
  descriptionS3Key,
  onChange,
  onDescriptionLoaded,
  editorRef,
  editable = true,
}: EditIssueDescriptionEditorProps) {
  const { data: loadedBlocks, isLoading } = useGetIssueDescription(
    issueId,
    descriptionS3Key,
  )

  const hasSeeded = useRef(false)

  // Read project context from Redux — same pattern used throughout the codebase
  // (e.g., page-title.tsx:27). ProjectFieldsFragment includes both id + workspaceId.
  const project = useAppSelector(selectCurrentProject)
  const { getToken } = useAuth()

  // ── Vault upload adapter ───────────────────────────────────────────────────
  // Must be declared BEFORE useCreateBlockNote so it can be passed as an option.
  // If project is not yet in Redux (edge case), uploadFile is undefined —
  // the editor simply won't show the file upload UI (graceful degradation).
  const uploadAdapter = project?.id
    ? createBlockNoteUploadAdapter({
        workspaceId: project.workspaceId,
        projectId: project.id,
        source: 'TASK',
        sourceId: issueId,
        getToken,
      })
    : undefined

  const editor = useCreateBlockNote({
    // Spread full en dictionary, override only placeholder
    dictionary: {
      ...en,
      placeholders: {
        ...en.placeholders,
        default: 'Add description…',
      },
    },
    // Zero out the side-menu gutter padding so text aligns with the title
    domAttributes: {
      editor: {
        style:
          'padding-left: 0; padding-right: 0; padding-top: 4px; font-size: 0.875rem;',
      },
    },
    // uploadFile is an editor-level capability — handles paste, D&D, and
    // the /image slash command. Undefined if project context is not loaded.
    uploadFile: uploadAdapter,
  })

  // Expose editor instance to parent for synchronous reads on save
  useEffect(() => {
    if (editorRef) editorRef.current = editor
  }, [editor, editorRef])

  // Vault unreferenced tracking: seed savedFileIdsRef when S3 content loads.
  // The ref is updated on every onChange so the parent's save handler always
  // gets the latest diff when it calls editor.document.
  const savedFileIdsRef = useRef<Set<string>>(new Set())

  // blockFileMap: Map<blockId, fileId> — populated by refreshVaultUrls BEFORE
  // vault://fileId is replaced with presigned URLs in the editor blocks.
  // Lets extractTrackedFileIds detect deletions by blockId presence.
  const blockFileMapRef = useRef<Map<string, string>>(new Map())

  // Load S3 content into editor once it arrives.
  // Also triggers refreshVaultUrls so vault:// references resolve on load.
  useEffect(() => {
    if (!loadedBlocks || hasSeeded.current) return
    hasSeeded.current = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    editor.replaceBlocks(editor.document as any, loadedBlocks)
    onDescriptionLoaded(loadedBlocks)
    // Seed the saved fileIds snapshot from the loaded content.
    const initialIds = extractVaultFileIds(editor.document)
    savedFileIdsRef.current = initialIds
    log.debug('[SNAPSHOT_SEEDED]', {
      issueId,
      fileIds: [...initialIds],
      count: initialIds.size,
    })
    // Resolve vault:// URL refs now that the S3 content has been seeded.
    void refreshVaultUrls(editor, getToken, blockFileMapRef.current)
  }, [loadedBlocks, editor, onDescriptionLoaded, getToken, issueId])

  // If no descriptionS3Key → seed parent with empty blocks baseline
  useEffect(() => {
    if (descriptionS3Key || hasSeeded.current) return
    hasSeeded.current = true
    onDescriptionLoaded([])
  }, [descriptionS3Key, onDescriptionLoaded])

  // Propagate content changes to parent + resolve newly uploaded vault:// URLs.
  // A single editor.onChange subscription handles both to avoid double-subscriptions.
  // Vault URL resolution: uploadFile returns `vault://fileId`; BlockNote writes it to
  // the block; onChange fires; we detect the vault:// scheme and resolve immediately
  // so the image appears without a page reload.
  //
  // Unreferenced tracking: on every change we diff saved vs current fileIds.
  // If files were removed, we call markFilesUnreferenced (fire-and-forget).
  // Issues have an explicit Save button — onChange fires before save, so the
  // diff here represents the editor's current in-flight state. We call mark
  // here (not at save time) so the grace period window starts from the LAST
  // time the user deleted the block, not from when they click Save.
  const prevBlocks = useRef<string>('')
  useEffect(() => {
    return editor.onChange(() => {
      const serialised = JSON.stringify(editor.document)
      if (serialised !== prevBlocks.current) {
        prevBlocks.current = serialised
        onChange(editor.document)

        // Resolve any vault:// refs introduced by this change (e.g. fresh uploads)
        const hasVaultUrl = (editor.document as Array<any>).some(
          (b: any) =>
            typeof b.props?.url === 'string' && b.props.url.startsWith('vault://'),
        )
        if (hasVaultUrl) void refreshVaultUrls(editor, getToken, blockFileMapRef.current)

        // Diff for unreferenced tracking — use blockFileMap to detect removals
        // by blockId presence (works after vault:// is replaced with presigned URL).
        const trackedIds = extractTrackedFileIds(editor.document, blockFileMapRef.current)
        const currentIds = trackedIds.size > 0 || blockFileMapRef.current.size > 0
          ? trackedIds
          : extractVaultFileIds(editor.document)
        const removed = [...savedFileIdsRef.current].filter(
          (id) => !currentIds.has(id),
        )
        savedFileIdsRef.current = currentIds

        log.debug('[UNREF_DIFF]', {
          issueId,
          currentIds: [...currentIds],
          removedIds: removed,
          hasRemovals: removed.length > 0,
        })

        if (removed.length > 0) {
          void getToken().then((token) => {
            if (!token) return
            markFilesUnreferenced(removed, issueId, VaultFileSource.Task, token)
              .then(() => {
                log.info('[FILE_MARKED_UNREFERENCED]', {
                  issueId,
                  removedIds: removed,
                  markedCount: removed.length,
                })
              })
              .catch((err) => {
                log.warn('[UNREF_MARK_FAILED]', { err, removedIds: removed, issueId })
              })
          })
        }
      }
    })
  }, [editor, onChange, getToken, issueId])

  if (isLoading) {
    return (
      <div className="py-2 text-sm text-muted-foreground animate-pulse">
        Loading description…
      </div>
    )
  }

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme="light"
      sideMenu={false}
    />
  )
}
