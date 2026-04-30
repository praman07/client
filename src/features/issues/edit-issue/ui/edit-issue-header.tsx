/**
 * EditIssueHeader — top bar of the edit-issue modal.
 *
 * Shows:
 *   - Issue identifier (e.g. "AIS-12")
 *   - Save button (enabled when there are unsaved changes)
 *   - ⋯ overflow menu (Delete issue)
 *   - × close button
 *
 * @layer Features
 */
import {
  X,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { IssueNumber } from '@/entities/issue'

interface EditIssueHeaderProps {
  projectKey: string
  issueNumber: number
  isDirty: boolean
  isSaving: boolean
  onSave: () => void
  onDelete: () => void
  onClose: () => void
}

export function EditIssueHeader({
  projectKey,
  issueNumber,
  isDirty,
  isSaving,
  onSave,
  onDelete,
  onClose,
}: EditIssueHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-2.5 shrink-0">
      <IssueNumber projectKey={projectKey} number={issueNumber} />

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          disabled={!isDirty || isSaving}
          onClick={onSave}
          className="h-7 text-11 px-3"
        >
          {isSaving ? 'Saving\u2026' : 'Save'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-layer-transparent-hover transition-colors cursor-pointer">
            <MoreHorizontal
              strokeWidth={2}
              className="size-4"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-danger-primary focus:text-danger-primary"
              onClick={onDelete}
            >
              <Trash2
                strokeWidth={2}
                className="size-4 mr-2"
              />
              Delete issue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={onClose}
          className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-layer-1-hover transition-colors cursor-pointer"
        >
          <X
            strokeWidth={2}
            className="size-4"
          />
        </button>
      </div>
    </div>
  )
}
