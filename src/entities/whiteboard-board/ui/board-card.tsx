import { BoardStatusBadge } from '.'
import type { Board } from '../model/types'

interface BoardCardProps {
  board: Board
  onClick?: () => void
}

export function BoardCard({ board, onClick }: BoardCardProps) {
  return (
    <div
      className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{board.title}</h3>
        <BoardStatusBadge board={board} />
      </div>
      {board.description && (
        <p className="mt-2 text-sm text-muted-foreground">
          {board.description}
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Updated {new Date(board.updatedAt).toLocaleDateString()}
      </p>
    </div>
  )
}
