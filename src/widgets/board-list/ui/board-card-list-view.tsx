import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { Archive, Lock, MoreHorizontal } from 'lucide-react'
import { BoardThumbnail } from './board-thumbnail'
import type { Board } from '@/entities/whiteboard-board'
import { Badge } from '@/shared/ui/primitives/badge'

interface BoardCardListViewProps {
  board: Board
  workspaceSlug: string
  projectSlug: string
  onOpenMenu?: (e: React.MouseEvent) => void
}

/**
 * List view card for a whiteboard board.
 *
 * Layout:
 *  ┌──────┬────────────────────────────┬─────────┬───────┐
 *  │ 🖼️   │  Title                     │ badges  │ time  │
 *  │      │  description (opt)         │         │  [•]  │
 *  └──────┴────────────────────────────┴─────────┴───────┘
 *
 * On mobile: badges + time collapse to below the title.
 */
export function BoardCardListView({
  board,
  workspaceSlug,
  projectSlug,
  onOpenMenu,
}: BoardCardListViewProps) {
  return (
    <article className="group relative">
      <Link
        to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId"
        params={{ workspaceSlug, projectSlug, boardId: board.id }}
        className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-xl border border-border/50 bg-card hover:bg-muted/20 hover:border-primary/30 hover:shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        {/* Thumbnail — fixed width, responsive size */}
        <div className="w-16 sm:w-20 shrink-0 rounded-lg overflow-hidden border border-border/40 bg-muted/30 aspect-video">
          <BoardThumbnail boardId={board.id} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug truncate text-foreground group-hover:text-primary transition-colors duration-150">
            {board.title}
          </h3>
          {board.description ? (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {board.description}
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Edited {formatDistanceToNow(new Date(board.updatedAt), { addSuffix: false })} ago
            </p>
          )}
        </div>

        {/* Status badges — hidden on very small screens */}
        {(board.isArchived || board.isLocked) && (
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            {board.isArchived && (
              <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                <Archive className="h-2.5 w-2.5" />
                <span className="hidden md:inline">Archived</span>
              </Badge>
            )}
            {board.isLocked && (
              <Badge variant="secondary" className="gap-1 text-[10px] h-5 px-1.5">
                <Lock className="h-2.5 w-2.5" />
                <span className="hidden md:inline">Locked</span>
              </Badge>
            )}
          </div>
        )}

        {/* Last edited — hidden when description shown (shown in its place) */}
        {board.description && (
          <p className="hidden sm:block text-[11px] text-muted-foreground shrink-0 tabular-nums">
            {formatDistanceToNow(new Date(board.updatedAt), { addSuffix: false })} ago
          </p>
        )}
      </Link>

      {/* Context menu button — absolute so it doesn't affect list layout */}
      {onOpenMenu && (
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Board options"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )}
    </article>
  )
}
