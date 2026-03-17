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

interface EditIssueDescriptionEditorProps {
  issueId: string
  descriptionS3Key: string | null
   
  onChange: (blocks: Array<any>) => void
   
  onDescriptionLoaded: (blocks: Array<any>) => void
   
  editorRef?: React.MutableRefObject<BlockNoteEditor<any> | null>
  editable?: boolean
}

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

  const editor = useCreateBlockNote({
    // Spread full en dictionary, override only placeholder
    dictionary: {
      ...en,
      placeholders: {
        ...en.placeholders,
        default: 'Add description\u2026',
      },
    },
    // Zero out the side-menu gutter padding so text aligns with the title
    domAttributes: {
      editor: {
        style:
          'padding-left: 0; padding-right: 0; padding-top: 4px; font-size: 0.875rem;',
      },
    },
  })

  // Expose editor instance to parent for synchronous reads on save
  useEffect(() => {
    if (editorRef) editorRef.current = editor
  }, [editor, editorRef])

  // Load S3 content into editor once it arrives
  useEffect(() => {
    if (!loadedBlocks || hasSeeded.current) return
    hasSeeded.current = true
     
    editor.replaceBlocks(editor.document as any, loadedBlocks)
    onDescriptionLoaded(loadedBlocks)
  }, [loadedBlocks, editor, onDescriptionLoaded])

  // If no descriptionS3Key → seed parent with empty blocks baseline
  useEffect(() => {
    if (descriptionS3Key || hasSeeded.current) return
    hasSeeded.current = true
    onDescriptionLoaded([])
  }, [descriptionS3Key, onDescriptionLoaded])

  // Propagate content changes to parent
  const prevBlocks = useRef<string>('')
  useEffect(() => {
    return editor.onChange(() => {
      const serialised = JSON.stringify(editor.document)
      if (serialised !== prevBlocks.current) {
        prevBlocks.current = serialised
        onChange(editor.document)
      }
    })
  }, [editor, onChange])

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
