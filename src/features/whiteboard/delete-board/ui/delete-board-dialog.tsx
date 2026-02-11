import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { useDeleteBoard } from '../hooks'
import { mapDeleteBoardError } from '../lib'

interface DeleteBoardDialogProps {
  boardId: string
  boardTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteBoardDialog({
  boardId,
  boardTitle,
  open,
  onOpenChange,
  onSuccess,
}: DeleteBoardDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { mutateAsync: deleteBoard } = useDeleteBoard()

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deleteBoard(boardId)
      toast.success('Board deleted successfully')
      onSuccess?.()
      onOpenChange(false)
    } catch (error: any) {
      const message = mapDeleteBoardError(error)
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Board?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold">{boardTitle}</span>? This action
            cannot be undone. All board data will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Board'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
