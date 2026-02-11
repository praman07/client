import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { CreateBoardForm } from './create-board-form'

interface CreateBoardModalProps {
  workspaceId: string
  projectId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (boardId: string) => void
}

/**
 * Modal wrapper for create board form
 *
 * Usage: Triggered from "New Board" button in workspace/project
 */
export function CreateBoardModal({
  workspaceId,
  projectId,
  open,
  onOpenChange,
  onSuccess,
}: CreateBoardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <CreateBoardForm
          workspaceId={workspaceId}
          projectId={projectId}
          onSuccess={(boardId) => {
            onSuccess?.(boardId)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
