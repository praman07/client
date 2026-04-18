import { useEffect, useState } from 'react'
import { WhiteboardCanvas } from '@/widgets/whiteboard-canvas'
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
 * - Canvas fills the full remaining height after the app header
 * - Collaborator presence strip is rendered inline via Excalidraw's renderTopRightUI
 *
 * Note: The CollaborationSidebar has been removed in favour of the inline
 * CanvasCollaborators avatar strip inside the canvas component.
 */
export function BoardViewPage({
  boardId,
  workspaceSlug,
  projectSlug,
}: BoardViewPageProps) {
  const [isBoardDeleted, setIsBoardDeleted] = useState(false)

  // Register deletion callback so the WS handler can trigger the overlay
  useEffect(() => {
    registerBoardDeletedCallback(boardId, () => setIsBoardDeleted(true))
    return () => unregisterBoardDeletedCallback(boardId)
  }, [boardId])

  return (
    <div className="h-full w-full relative overflow-hidden bg-surface-1">
      {/* Board deleted overlay — blocks canvas interaction */}
      {isBoardDeleted && (
        <BoardDeletedOverlay
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
        />
      )}

      <WhiteboardCanvas boardId={boardId} />
    </div>
  )
}
