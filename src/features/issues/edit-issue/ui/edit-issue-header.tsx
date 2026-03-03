/**
 * Top bar of the edit-issue modal.
 * Displays issue identifier, Save button, delete menu, and close.
 *
 * Uses DropdownMenu (base-ui) — no asChild prop on DropdownMenuTrigger.
 * @layer Features
 */
import { X, Trash2 } from 'lucide-react'
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
    <div className="flex items-center justify-between border-b px-4 py-3">
      <IssueNumber projectKey={projectKey} number={issueNumber} />

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={!isDirty || isSaving}
          onClick={onSave}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <span className="text-sm font-bold leading-none">⋯</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete issue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
