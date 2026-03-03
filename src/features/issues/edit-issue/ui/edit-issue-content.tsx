/**
 * Main content area of the edit-issue modal.
 *
 * Contains:
 *   1. Title — auto-resize Textarea, onChange → setLocalTitle (no mutation)
 *   2. Description — BlockNote editor placeholder
 *      (BlockNote is a heavy dep; actual integration happens when
 *       BlockNote package is available in the project)
 *
 * Both are passive local-state only. No network call until Save.
 *
 * @layer Features
 */
import { useEffect, useRef } from 'react'
import { Textarea } from '@/shared/ui/primitives/textarea'

interface EditIssueContentProps {
  title: string
  onTitleChange: (title: string) => void
  descriptionS3Key: string | null
  issueId: string
  /** Called on every BlockNote document change with the current block array */
  onBlocksChange: (blocks: unknown[]) => void
}

export function EditIssueContent({
  title,
  onTitleChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  descriptionS3Key: _descriptionS3Key,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  issueId: _issueId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBlocksChange: _onBlocksChange,
}: EditIssueContentProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea to fit content
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [title])

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4 gap-4">
      {/* Title */}
      <Textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Issue title"
        className="resize-none border-none bg-transparent px-0 text-xl font-semibold shadow-none focus-visible:ring-0 leading-snug"
        rows={1}
      />

      {/* Description placeholder */}
      {/* TODO: Wire up BlockNote editor when available */}
      <div
        className="min-h-[200px] rounded-md border border-dashed border-border px-4 py-3 text-sm text-muted-foreground cursor-text"
        onClick={() => {
          // BlockNote editor will mount here
        }}
      >
        Add a description…
      </div>
    </div>
  )
}
