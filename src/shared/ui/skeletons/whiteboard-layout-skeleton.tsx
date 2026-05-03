import { BoardListSkeleton } from './board-list-skeleton'

/**
 * WhiteboardLayoutSkeleton
 *
 * Layout-level skeleton for the /whiteboard route.
 * Shown as `pendingComponent` while TanStack Router resolves the route
 * and the whiteboard WS plugin initialises.
 *
 * Reuses BoardListSkeleton — the whiteboard layout IS the board list index.
 */
export function WhiteboardLayoutSkeleton() {
  return <BoardListSkeleton />
}
