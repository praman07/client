/**
 * StatusListRow — One row in ManageStatusesModal.
 *
 * Shows:
 *   [StatusIcon] [Inline name Input] [🔒 or 🗑️]
 *
 * Inline name edit fires useUpdateStatus onBlur.
 * System columns show a lock icon; delete is disabled.
 * Columns with issues show a tooltip on the delete button.
 *
 * @layer Features
 */
import { Lock, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDeleteStatus, useUpdateStatus } from '../hooks'
import { mapStatusError } from '../lib/error-mapping'
import { StatusIconPicker } from './status-icon-picker'
import type { IssueStatus } from '@/entities/issue-status'
import { Input } from '@/shared/ui/primitives/input'
import { Button } from '@/shared/ui/primitives/button'

interface StatusListRowProps {
  status: IssueStatus
  projectId: string
}

export function StatusListRow({ status, projectId }: StatusListRowProps) {
  const { mutateAsync: updateStatus } = useUpdateStatus(projectId)
  const { mutateAsync: deleteStatus } = useDeleteStatus(projectId)

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newName = e.target.value.trim()
    if (newName && newName !== status.name) {
      updateStatus({ statusId: status.id, name: newName }).catch((err) =>
        toast.error(mapStatusError(err)),
      )
    }
  }

  const handleDelete = () => {
    deleteStatus(status.id).catch((err) => toast.error(mapStatusError(err)))
  }

  return (
    <div className="flex items-center gap-2 py-1">
      {/* Icon + color picker — opens popover on click */}
      <StatusIconPicker status={status} projectId={projectId} />
      <Input
        defaultValue={status.name}
        className="h-7 flex-1 border-transparent bg-transparent px-1 hover:border-subtle focus:border-subtle"
        disabled={status.isSystem}
        onBlur={handleNameBlur}
      />
      {status.isSystem ? (
        <Lock
          className="h-3.5 w-3.5 shrink-0 text-secondary"
          aria-label="System column — cannot be deleted"
        />
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-secondary hover:text-danger-primary"
          disabled={status.issueCount > 0}
          title={
            status.issueCount > 0
              ? 'Move or delete all issues before deleting this column'
              : 'Delete column'
          }
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
