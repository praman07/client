import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'

interface ArchiveBoardDialogProps {
  boardTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

/**
 * Confirmation dialog for archiving a board
 */
export function ArchiveBoardDialog({
  boardTitle,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ArchiveBoardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive Board</DialogTitle>
          <DialogDescription>
            Archive "{boardTitle}"? The board will be hidden from active views
            but can be restored later.
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
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Archiving...' : 'Archive'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
