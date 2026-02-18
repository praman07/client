import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { Clock } from 'lucide-react'
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
      className="group flex flex-col rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer"
    >
      {/* Thumbnail area — distinct bg so white drawings don't bleed into card */}
      <div className="border-b bg-muted/40">
        <BoardThumbnail boardId={board.id} />
      </div>

      {/* Card footer */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
          {board.title}
        </h3>
        <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(board.updatedAt))}
        </span>
      </div>
    </Link>
  )
}
