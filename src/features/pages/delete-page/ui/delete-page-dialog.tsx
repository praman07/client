import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'

export interface DeletePageDialogProps {
  pageTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

/**
 * Confirmation dialog for deleting a page.
 *
 * Warns the user that child pages will NOT be automatically deleted —
 * descendants must be handled explicitly first.
 */
export function DeletePageDialog({
  pageTitle,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeletePageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Page</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{pageTitle}&rdquo;? This action
            cannot be undone. Child pages will not be deleted automatically.
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
