import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { BoardThumbnail } from './board-thumbnail'
import type { Board } from '@/entities/whiteboard-board'

interface BoardCardGridViewProps {
  board: Board
  workspaceSlug: string
  projectSlug: string
}

/**
 * Grid view rendering for board card
 */
export function BoardCardGridView({
  board,
  workspaceSlug,
  projectSlug,
}: BoardCardGridViewProps) {
  return (
    <Link
      to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId"
      params={{
        workspaceSlug,
        projectSlug,
        boardId: board.id,
      }}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
    >
      <BoardThumbnail boardId={board.id} thumbnail={board.thumbnail} />

      <div className="p-3 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{board.title}</h3>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(board.updatedAt))} ago
          </p>
        </div>
      </div>
    </Link>
  )
}
