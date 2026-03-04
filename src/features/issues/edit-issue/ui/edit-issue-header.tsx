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
import { Button } from '@/shared/ui/primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon, Delete02Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons'
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
          className="h-7 text-xs px-3"
        >
          {isSaving ? 'Saving\u2026' : 'Save'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted/60 transition-colors cursor-pointer">
            <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4 mr-2" />
              Delete issue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={onClose}
          className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted/60 transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-4" />
        </button>
      </div>
    </div>
  )
}
