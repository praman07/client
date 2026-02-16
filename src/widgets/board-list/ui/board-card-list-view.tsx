import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { BoardThumbnail } from './board-thumbnail'
import type { Board } from '@/entities/whiteboard-board'

interface BoardCardListViewProps {
  board: Board
  workspaceSlug: string
  projectSlug: string
}

/**
 * List view rendering for board card
 */
export function BoardCardListView({
  board,
  workspaceSlug,
  projectSlug,
}: BoardCardListViewProps) {
  return (
    <Link
      to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId"
      params={{
        workspaceSlug,
        projectSlug,
        boardId: board.id,
      }}
      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
    >
      <div className="w-32 shrink-0">
        <BoardThumbnail boardId={board.id} thumbnail={board.thumbnail} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{board.title}</h3>
        <p className="text-sm text-muted-foreground">
          Updated {formatDistanceToNow(new Date(board.updatedAt))} ago
        </p>
      </div>
    </Link>
  )
}
