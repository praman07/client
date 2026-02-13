import { useState } from 'react'
import { useArchiveBoard } from '@/features/whiteboard/archive-board/hooks'
import { useDeleteBoard } from '@/features/whiteboard/delete-board/hooks'
import { Button } from '@/shared/ui/primitives/button'
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
import { Archive, Trash2, AlertTriangle } from 'lucide-react'

interface DangerZoneProps {
  boardId: string
  onDeleted?: () => void
}

/**
 * Danger zone tab
 * 
 * Archive or permanently delete board
 */
export function DangerZone({ boardId, onDeleted }: DangerZoneProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const archiveBoard = useArchiveBoard()
  const deleteBoard = useDeleteBoard()

  const handleArchive = async () => {
    await archiveBoard.mutateAsync(boardId)
  }

  const handleDelete = async () => {
    await deleteBoard.mutateAsync(boardId)
    setShowDeleteDialog(false)
    onDeleted?.()
  }

  return (
    <div className="space-y-6">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="text-sm">
          <strong className="text-destructive">Danger Zone</strong>
          <p className="text-muted-foreground mt-1">
            These actions are irreversible. Please proceed with caution.
          </p>
        </div>
      </div>

      {/* Archive Board */}
      <div className="border rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archive Board
            </h4>
            <p className="text-sm text-muted-foreground">
              Hide this board from your list. You can restore it later from archived boards.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleArchive}
            disabled={archiveBoard.isPending}
          >
            {archiveBoard.isPending ? 'Archiving...' : 'Archive'}
          </Button>
        </div>
      </div>

      {/* Delete Board */}
      <div className="border border-destructive/20 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete Board Permanently
            </h4>
            <p className="text-sm text-muted-foreground">
              Once deleted, this board and all its content cannot be recovered.
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the board
              and remove all its content from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteBoard.isPending ? 'Deleting...' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
