import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'
import { AddCollaboratorsForm } from './add-collaborators-form'

interface WorkspaceMember {
  id: string
  user: {
    id: string
    fullName: string
    email: string
    avatarUrl: string | null
  }
}

interface AddCollaboratorsDialogProps {
  boardId: string
  workspaceMembers: WorkspaceMember[]
  currentCollaboratorIds: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Dialog wrapper for adding collaborators to a board
 *
 * Handles edge case: no available members to add
 */
export function AddCollaboratorsDialog({
  boardId,
  workspaceMembers,
  currentCollaboratorIds,
  open,
  onOpenChange,
}: AddCollaboratorsDialogProps) {
  // Filter out current collaborators
  const availableMembers = workspaceMembers.filter(
    (member) => !currentCollaboratorIds.includes(member.user.id),
  )

  if (availableMembers.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Collaborators</DialogTitle>
            <DialogDescription>
              All workspace members are already collaborators on this board.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Collaborators</DialogTitle>
          <DialogDescription>
            Select workspace members to add to this board
          </DialogDescription>
        </DialogHeader>
        <AddCollaboratorsForm
          boardId={boardId}
          availableMembers={availableMembers}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
