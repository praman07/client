/**
 * ManageLabelsModal — Dialog for CRUD of project labels.
 *
 * Lists all labels via LabelListRow (inline edit + confirm delete).
 * Footer: CreateLabelForm (collapsed by default, toggle with button).
 *
 * @layer Features
 */
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useSelector } from 'react-redux'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'
import { selectIssueLabels } from '@/entities/issue'
import { LabelListRow } from './label-list-row'
import { CreateLabelForm } from './create-label-form'

interface ManageLabelsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export function ManageLabelsModal({
  open,
  onOpenChange,
  projectId,
}: ManageLabelsModalProps) {
  const labels = useSelector(selectIssueLabels)
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage labels</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          {labels.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No labels yet. Create one below.
            </p>
          )}
          {labels.map((label) => (
            <LabelListRow key={label.id} label={label} projectId={projectId} />
          ))}
        </div>

        {showCreateForm ? (
          <CreateLabelForm
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
            <Plus className="mr-1.5 h-4 w-4" /> Add label
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
