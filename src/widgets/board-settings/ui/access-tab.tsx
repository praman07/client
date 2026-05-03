import { Lock, Unlock } from 'lucide-react'
import { useBoard } from '@/features/whiteboard/fetch-board'
import { useLockBoard } from '@/features/whiteboard/lock-board'
import { useUnlockBoard } from '@/features/whiteboard/unlock-board'
import { Button } from '@/shared/ui/primitives/button'
import { Label } from '@/shared/ui/primitives/label'

interface AccessTabProps {
  boardId: string
}

/**
 * Access settings tab
 *
 * Lock/unlock board (read-only mode)
 */
export function AccessTab({ boardId }: AccessTabProps) {
  const { data } = useBoard(boardId)
  const board = data?.getBoard
  const lockBoard = useLockBoard()
  const unlockBoard = useUnlockBoard()

  const handleToggleLock = async () => {
    if (board?.isLocked) {
      await unlockBoard.mutateAsync(boardId)
    } else {
      await lockBoard.mutateAsync(boardId)
    }
  }

  const isPending = lockBoard.isPending || unlockBoard.isPending

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-14 font-medium mb-4">Board Access</h3>

        <div className="border border-subtle rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                {board?.isLocked ? (
                  <Lock className="h-4 w-4 text-danger-primary" />
                ) : (
                  <Unlock className="h-4 w-4 text-success-primary" />
                )}
                {board?.isLocked ? 'Board is Locked' : 'Board is Unlocked'}
              </Label>
              <p className="text-13 text-secondary">
                {board?.isLocked
                  ? 'Collaborators can view but not edit. Only you can unlock.'
                  : 'All collaborators can view and edit freely.'}
              </p>
            </div>

            <Button
              variant={board?.isLocked ? 'default' : 'outline'}
              onClick={handleToggleLock}
              disabled={isPending}
            >
              {isPending
                ? 'Processing...'
                : board?.isLocked
                  ? 'Unlock Board'
                  : 'Lock Board'}
            </Button>
          </div>

          {board?.isLocked && (
            <div className="bg-danger-subtle text-danger-primary text-12 p-3 rounded-md">
              <strong>Note:</strong> Locking prevents all edits from
              collaborators. They can still view and navigate the board.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
