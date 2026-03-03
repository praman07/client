/**
 * Dialog shell wrapping the CreateIssueForm.
 * Mirrors the create-folder-modal.tsx pattern exactly.
 *
 * @layer Features
 */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { CreateIssueForm } from './create-issue-form'

interface CreateIssueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  /** The column ID where + was clicked — pre-selects the status field */
  defaultStatusId: string
  projectMembers: Array<{ id: string; fullName: string }>
}

export function CreateIssueModal({
  open,
  onOpenChange,
  projectId,
  defaultStatusId,
  projectMembers,
}: CreateIssueModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New issue</DialogTitle>
        </DialogHeader>
        <CreateIssueForm
          projectId={projectId}
          defaultStatusId={defaultStatusId}
          projectMembers={projectMembers}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
