import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'

interface DeleteBoardDialogProps {
  boardTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

/**
 * Confirmation dialog for deleting a board
 */
export function DeleteBoardDialog({
  boardTitle,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteBoardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Board</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{boardTitle}"? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="text-white"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
