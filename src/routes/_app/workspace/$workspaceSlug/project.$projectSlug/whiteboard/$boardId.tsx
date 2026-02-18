import { createFileRoute } from '@tanstack/react-router'
import { BoardViewPage } from '@/pages/whiteboard'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId',
)({
  component: WhiteboardBoardRoute,
})

/**
 * Whiteboard Board Route
 *
 * Displays individual board view at /whiteboard/:boardId
 */
function WhiteboardBoardRoute() {
  const { boardId, workspaceSlug, projectSlug } = Route.useParams()

  return (
    <BoardViewPage
      boardId={boardId}
      workspaceSlug={workspaceSlug}
      projectSlug={projectSlug}
    />
  )
}
