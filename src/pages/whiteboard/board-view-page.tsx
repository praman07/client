import { useState, useEffect } from 'react'
import { WhiteboardCanvas } from '@/widgets/whiteboard-canvas'
import { CollaborationSidebar } from '@/widgets/collaboration-sidebar'
import { SidebarProvider } from '@/shared/ui/primitives/sidebar'
import { BoardDeletedOverlay } from '@/features/whiteboard/delete-board'
import {
  registerBoardDeletedCallback,
  unregisterBoardDeletedCallback,
} from '@/features/whiteboard/events'

interface BoardViewPageProps {
  boardId: string
  workspaceSlug: string
  projectSlug: string
}

/**
 * Whiteboard board view page
 *
 * Layout:
 * - Canvas (full remaining height after header)
 * - Collapsible collaboration sidebar (right)
 *
 * Note: This page is rendered within _app layout which has a header.
 * The h-full class makes it take the remaining space after the header.
 */
export function BoardViewPage({ boardId, workspaceSlug, projectSlug }: BoardViewPageProps) {
  const [isBoardDeleted, setIsBoardDeleted] = useState(false)

  // Register deletion callback so the WS handler can trigger the overlay
  useEffect(() => {
    registerBoardDeletedCallback(boardId, () => setIsBoardDeleted(true))
    return () => unregisterBoardDeletedCallback(boardId)
  }, [boardId])

  return (
    <div className="h-full w-full flex overflow-hidden bg-background relative">
      {/* Board deleted overlay — blocks canvas interaction */}
      {isBoardDeleted && (
        <BoardDeletedOverlay
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
        />
      )}

      <SidebarProvider defaultOpen={true}>
        {/* Canvas - Takes remaining space */}
        <div className="flex-1 relative">
          <WhiteboardCanvas boardId={boardId} />
        </div>

        {/* Collaboration Sidebar - Collapsible, positioned absolute to respect parent height */}
        <div className="relative">
          <CollaborationSidebar boardId={boardId} />
        </div>
      </SidebarProvider>
    </div>
  )
}
