import { useState } from 'react'
import type { Board } from '@/entities/whiteboard-board'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'

interface RenameBoardDialogProps {
  board: Board
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (newName: string) => void
  isPending: boolean
}

/**
 * Dialog for renaming a board
 */
export function RenameBoardDialog({
  board,
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: RenameBoardDialogProps) {
  const [newBoardName, setNewBoardName] = useState(board.title)

  // Reset name when dialog opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setNewBoardName(board.title)
    }
    onOpenChange(isOpen)
  }

  const handleSubmit = () => {
    if (newBoardName.trim() === board.title.trim()) {
      onOpenChange(false)
      return
    }
    onSubmit(newBoardName.trim())
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="board-name">Board Name</Label>
            <Input
              id="board-name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newBoardName.trim()) {
                  handleSubmit()
                }
              }}
              disabled={isPending}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!newBoardName.trim() || isPending}
          >
            {isPending ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
