/**
 * IssueDescriptionEditor — standalone BlockNote editor for issue creation.
 *
 * Unlike the page editor this has NO Yjs collaboration. It is a simple
 * local-state editor whose content is serialised to JSON on submit and
 * then uploaded to S3 via the 3-step presigned URL flow.
 *
 * Styling:
 *   - domAttributes.editor.style zeroes BlockNote's default left padding
 *     (the gutter that normally reserves space for the side menu).
 *   - dictionary.placeholders.default sets the "Add description…" hint.
 *   - sideMenu={false} removes the drag handle / add-block side menu.
 *   - formattingToolbar={false} removes the selection toolbar.
 *
 * Props:
 *   onChange   — called with editor.document on every content change
 *   editorRef  — caller uses this to read the current blocks on submit
 *   editable   — pass false while the mutation is pending
 *
 * @layer Features
 */
import '@blocknote/shadcn/style.css'
import { useEffect, useRef } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'


import type { BlockNoteEditor } from '@blocknote/core'
import { en } from '@blocknote/core/locales'

interface IssueDescriptionEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (blocks: any[]) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorRef: React.MutableRefObject<BlockNoteEditor<any> | null>
  editable?: boolean
}

export function IssueDescriptionEditor({
  onChange,
  editorRef,
  editable = true,
}: IssueDescriptionEditorProps) {
  const editor = useCreateBlockNote({


    // ── Placeholder ────────────────────────────────────────────────────────────
    // Spread the default `en` dictionary then override only the one string.
    // A bare partial cast (`as any`) replaces the entire dictionary object,
    // wiping out all slash_menu item definitions and breaking the / command.
    dictionary: {
      ...en,
      placeholders: {
        ...en.placeholders,
        default: 'Add description\u2026',
      },
    },
    // ── Padding reset ──────────────────────────────────────────────────────────
    // BlockNote's .bn-editor has horizontal padding to accommodate the side
    // menu gutter (~54px left). We zero it out here via domAttributes so the
    // editor text aligns flush with the title textarea above it.
    domAttributes: {
      editor: {
        style:
          'padding-left: 0; padding-right: 0; padding-top: 4px; font-size: 0.875rem;',
      },
    },
  })

  // Expose the editor instance up to the parent form so it can read
  // editor.document synchronously on submit without going through state.
  useEffect(() => {
    editorRef.current = editor
  }, [editor, editorRef])

  // Propagate content changes up so the parent can track whether
  // there is any content before deciding to upload.
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

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme="light"
      // Remove side menu (drag handle / add-block button) — keeps the UI
      // clean inside the create modal and also eliminates the side gutter.
      sideMenu={false}
      // Remove the floating formatting toolbar — issue descriptions are
      // simple; full toolbar is available in the edit modal.
      formattingToolbar={false}
    />
  )
}
