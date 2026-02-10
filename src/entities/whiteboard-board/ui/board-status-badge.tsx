import { Lock, Archive } from 'lucide-react'
import type { Board } from '../model/types'

interface BoardStatusBadgeProps {
  board: Board
}

export function BoardStatusBadge({ board }: BoardStatusBadgeProps) {
  if (board.isLocked) {
    return (
      <div className="flex items-center gap-1 text-xs text-destructive">
        <Lock className="h-3 w-3" />
        Locked
      </div>
    )
  }

  if (board.isArchived) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Archive className="h-3 w-3" />
        Archived
      </div>
    )
  }

  return null
}
