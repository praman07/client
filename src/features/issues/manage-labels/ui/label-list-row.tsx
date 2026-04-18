/**
 * LabelListRow — One row in ManageLabelsModal.
 *
 * Shows:
 *   [ColorSwatch] [Inline name Input] [🗑️]
 *
 * Inline name edit fires useUpdateLabel onBlur.
 * Delete button shows confirmation before calling useDeleteLabel.
 *
 * @layer Features
 */
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDeleteLabel, useUpdateLabel } from '../hooks'
import { mapLabelError } from '../lib/error-mapping'
import type { IssueLabel } from '@/entities/issue-label'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/primitives/alert-dialog'

interface LabelListRowProps {
  label: IssueLabel
  projectId: string
}

export function LabelListRow({ label, projectId }: LabelListRowProps) {
  const { mutateAsync: updateLabel } = useUpdateLabel(projectId)
  const { mutateAsync: deleteLabel } = useDeleteLabel(projectId)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newName = e.target.value.trim()
    if (newName && newName !== label.name) {
      updateLabel({ labelId: label.id, name: newName }).catch((err) =>
        toast.error(mapLabelError(err)),
      )
    }
  }

  const handleConfirmDelete = () => {
    deleteLabel(label.id).catch((err) => toast.error(mapLabelError(err)))
  }

  return (
    <div className="flex items-center gap-2 py-1">
      {/* Color swatch */}
      <span
        className="h-3.5 w-3.5 shrink-0 rounded-full"
        style={{ backgroundColor: label.color }}
        aria-label={`Label color: ${label.color}`}
      />

      {/* Inline name */}
      <Input
        defaultValue={label.name}
        className="h-7 flex-1 border-transparent bg-transparent px-1 hover:border-border focus:border-border"
        onBlur={handleNameBlur}
      />

      {/* Delete with confirm */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-secondary hover:text-danger-primary"
              title="Delete label"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete label &quot;{label.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes the label from all issues in this project. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger-primary text-on-color hover:bg-danger-primary/90"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
