/**
 * EditIssueContent — Title + BlockNote description area (left panel).
 *
 * Title:       plain <Input> (single line, large text) — local state only.
 * Description: EditIssueDescriptionEditor wired to S3 load + change tracking.
 *
 * No mutations fire here — everything is buffered in the parent modal.
 *
 * @layer Features
 */
import { EditIssueDescriptionEditor } from './edit-issue-description-editor'
import { Input } from '@/shared/ui/primitives/input'

interface EditIssueContentProps {
  title: string
  onTitleChange: (title: string) => void
  issueId: string
  descriptionS3Key: string | null
  editable: boolean
   
  onBlocksChange: (blocks: Array<any>) => void
   
  onDescriptionLoaded: (blocks: Array<any>) => void
}

export function EditIssueContent({
  title,
  onTitleChange,
  issueId,
  descriptionS3Key,
  editable,
  onBlocksChange,
  onDescriptionLoaded,
}: EditIssueContentProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-5 pb-4 gap-0">
      {/* Title */}
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Issue title"
        disabled={!editable}
        className="border-none bg-transparent px-0 h-auto py-0 text-2xl md:text-2xl font-semibold shadow-none focus-visible:ring-0 leading-snug placeholder:text-muted-foreground/50"
      />

      {/* Description — BlockNote editor wired to S3 */}
      <div className="mt-1 flex-1">
        <EditIssueDescriptionEditor
          issueId={issueId}
          descriptionS3Key={descriptionS3Key}
          onChange={onBlocksChange}
          onDescriptionLoaded={onDescriptionLoaded}
          editable={editable}
        />
      </div>
    </div>
  )
}
