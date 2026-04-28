/**
 * EditIssueDescriptionEditor — BlockNote editor for the edit-issue modal.
 *
 * System Design Decision: Stateful Fetch & Hydration
 *   Unlike `create-issue`, this editor asynchronously loads state from S3 (`useGetIssueDescription`).
 *   `onDescriptionLoaded` initializes the parent's `originalBlocks` baseline for dirty tracking.
 *   Formatting features are fully enabled as this is the primary editing interface.
 *
 * // TODO (Architecture): Consider standardizing the BlockNote hydration pattern across both create/edit views.
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
  extractActiveFileIds,
  migrateDocumentUrls,
} from '@/shared/lib/blocknote'
import { VaultFileSource, markFilesUnreferenced } from '@/shared/api/vault'
import { createLogger } from '@/shared/lib/logger'
import { MentionMenuController, mentionSchema, useSyncMentions } from '@/features/mention'
import { BlockNoteEmojiPicker } from '@/features/blocknote/emoji-picker'

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

  // System Design Decision: Redux is the source of truth for the active project context.
  const project = useAppSelector(selectCurrentProject)
  const { getToken } = useAuth()

  // ── Vault upload adapter ───────────────────────────────────────────────────
  // System Design Decision: Graceful degradation for uninitialized context.
  // If `project` is undefined, `uploadFile` falls back to undefined, safely disabling upload UI.
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
    schema: mentionSchema,
    dictionary: {
      ...en,
      placeholders: {
        ...en.placeholders,
        default: 'Add description…',
      },
    },
    // // TODO (UX): Abstract custom padding override into centralized Shadcn theme configuration
    domAttributes: {
      editor: {
        style:
          'padding-left: 0; padding-right: 0; padding-top: 4px; font-size: 0.875rem;',
      },
    },
    uploadFile: uploadAdapter,
  })

  // Expose editor instance to parent for synchronous reads on save
  useEffect(() => {
    if (editorRef) {
      // Cast to `any` — parent only calls .document; safe regardless of schema generics
       
      editorRef.current = editor as any
    }
  }, [editor, editorRef])

  // Vault unreferenced tracking: seed savedFileIdsRef when S3 content loads.
  const savedFileIdsRef = useRef<Set<string>>(new Set())

  // System Design Decision: Client-Side Content Hydration
  // BlockNote requires imperative mutation (`replaceBlocks`) post-mount to hydrate async content.
  // A one-time URL migration is also bundled here to convert legacy `vault://` or `amazonaws` formats into permanent proxy URLs.
  // // TODO (Architecture): Abstract legacy URL migration into a centralized DB migration worker rather than imposing read-time penalty.
  useEffect(() => {
    if (!loadedBlocks || hasSeeded.current) return
    hasSeeded.current = true
     
    editor.replaceBlocks(editor.document as any, loadedBlocks)
    onDescriptionLoaded(loadedBlocks)
    // Migrate legacy URL formats and seed deletion tracker
    migrateDocumentUrls(editor)
    savedFileIdsRef.current = extractActiveFileIds(editor.document)
    log.debug('[SNAPSHOT_SEEDED]', {
      issueId,
      fileIds: [...savedFileIdsRef.current],
      count: savedFileIdsRef.current.size,
    })
  }, [loadedBlocks, editor, onDescriptionLoaded, issueId])

  // If no descriptionS3Key → seed parent with empty blocks baseline
  useEffect(() => {
    if (descriptionS3Key || hasSeeded.current) return
    hasSeeded.current = true
    onDescriptionLoaded([])
  }, [descriptionS3Key, onDescriptionLoaded])

  // System Design Decision: Editor State Propagation & Immediate Orphan Cleanup
  // A single `onChange` subscription orchestrates both parent state propagation and orphan tracking.
  // We execute `markFilesUnreferenced` aggressively (in-flight) on block deletion rather than waiting for explicitly pressed Save.
  // This accurately aligns the S3 grace period with actual user intent, avoiding orphaned files if a tab is closed prematurely.
  const prevBlocks = useRef<string>('')
  useEffect(() => {
    return editor.onChange(() => {
      const serialised = JSON.stringify(editor.document)
      if (serialised !== prevBlocks.current) {
        prevBlocks.current = serialised
        onChange(editor.document)

        // Diff for unreferenced tracking using permanent proxy URLs
        const currentIds = extractActiveFileIds(editor.document)
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

  // ── Mention sync ─────────────────────────────────────────────────────────
  const syncMentions = useSyncMentions({
    sourceEntityId:   issueId,
    sourceEntityType: 'ISSUE',
    editor,
  })
  useEffect(() => {
    return editor.onChange(() => {
      syncMentions()
    })
  }, [editor, syncMentions])

  if (isLoading) {
    return (
      <div className="py-2 text-sm text-secondary animate-pulse">
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
      emojiPicker={false}
    >
      {/* @-mention suggestion menu — backed by TanStack entity cache */}
      {project?.id && <MentionMenuController projectId={project.id} />}
      <BlockNoteEmojiPicker />
    </BlockNoteView>
  )
}
