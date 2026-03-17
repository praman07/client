/**
 * ManageStatusesModal — Dialog for CRUD + reorder of Kanban columns.
 *
 * Lists all project statuses via StatusListRow (inline edit, delete).
 * Footer: CreateStatusForm (collapsed by default, toggle with button).
 *
 * @layer Features
 */
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useSelector } from 'react-redux'
import { StatusListRow } from './status-list-row'
import { CreateStatusForm } from './create-status-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'
import { selectIssueStatuses } from '@/entities/issue'

interface ManageStatusesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export function ManageStatusesModal({
  open,
  onOpenChange,
  projectId,
}: ManageStatusesModalProps) {
  const statuses = useSelector(selectIssueStatuses)
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage columns</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          {statuses.map((status) => (
            <StatusListRow
              key={status.id}
              status={status}
              projectId={projectId}
            />
          ))}
        </div>

        {showCreateForm ? (
          <CreateStatusForm
            projectId={projectId}
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start text-muted-foreground"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add column
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
