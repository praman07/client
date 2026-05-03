import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { Archive, Lock, MoreHorizontal } from 'lucide-react'
import { BoardThumbnail } from './board-thumbnail'
import type { Board } from '@/entities/whiteboard-board'
import { Badge } from '@/shared/ui/primitives/badge'

interface BoardCardGridViewProps {
  board: Board
  workspaceSlug: string
  projectSlug: string
  onOpenMenu?: (e: React.MouseEvent) => void
}

/**
 * Grid view card for a whiteboard board.
 *
 * Layout:
 *  ┌─────────────────────────────┐
 *  │  [thumbnail — 16:9]         │   ← hover: dim + scale
 *  │  [badges top-left]          │
 *  ├─────────────────────────────┤
 *  │  title              [menu]  │
 *  │  Edited X ago               │
 *  └─────────────────────────────┘
 *
 * Responsive: always fills its grid cell width.
 */
export function BoardCardGridView({
  board,
  workspaceSlug,
  projectSlug,
  onOpenMenu,
}: BoardCardGridViewProps) {
  return (
    <article className="group relative flex flex-col rounded-xl border border-subtle/50 bg-layer-1 overflow-hidden shadow-raised-100 hover:shadow-raised-200 hover:border-accent-primary/30 transition-all duration-200">
      {/* ── Thumbnail ─────────────────────────────────────── */}
      <Link
        to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId"
        params={{ workspaceSlug, projectSlug, boardId: board.id }}
        className="block relative aspect-video overflow-hidden bg-layer-2/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60 focus-visible:ring-offset-2"
      >
        <BoardThumbnail boardId={board.id} />

        {/* Hover dim */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-200" />

        {/* Status badges — top-left */}
        {(board.isArchived || board.isLocked) && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {board.isArchived && (
              <Badge
                variant="secondary"
                className="gap-1 text-10 h-5 px-1.5 bg-surface-1/85 backdrop-blur-sm border border-subtle/40"
              >
                <Archive className="h-2.5 w-2.5" />
                Archived
              </Badge>
            )}
            {board.isLocked && (
              <Badge
                variant="secondary"
                className="gap-1 text-10 h-5 px-1.5 bg-surface-1/85 backdrop-blur-sm border border-subtle/40"
              >
                <Lock className="h-2.5 w-2.5" />
                Locked
              </Badge>
            )}
          </div>
        )}
      </Link>

      {/* ── Footer ────────────────────────────────────────── */}
      <div className="flex items-start gap-2 px-3.5 py-3 min-w-0">
        {/* Text block — link for navigation */}
        <Link
          to="/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId"
          params={{ workspaceSlug, projectSlug, boardId: board.id }}
          className="flex-1 min-w-0 focus-visible:outline-none"
        >
          <h3 className="font-semibold text-14 leading-snug truncate text-primary group-hover:text-primary transition-colors duration-150">
            {board.title}
          </h3>
          <p className="text-11 text-tertiary mt-0.5 truncate">
            Edited {formatDistanceToNow(new Date(board.updatedAt), { addSuffix: false })} ago
          </p>
        </Link>

        {/* Context menu trigger — only visible on hover */}
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Board options"
            className="shrink-0 mt-0.5 h-6 w-6 flex items-center justify-center rounded-md text-tertiary hover:text-primary hover:bg-layer-1 transition-colors invisible group-hover:visible focus-visible:visible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </article>
  )
}
