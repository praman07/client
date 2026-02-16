import { createFileRoute } from '@tanstack/react-router'
import { BoardListPage } from '@/pages/whiteboard'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace/model/selectors'
import { selectCurrentProject } from '@/entities/project/model/selectors'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/whiteboard/',
)({
  component: WhiteboardIndexRoute,
})

/**
 * Whiteboard Index Route
 *
 * Displays board list page at /whiteboard
 */
function WhiteboardIndexRoute() {
  const { workspaceSlug } = Route.useParams()

  // Get actual IDs from Redux (synced by parent layout)
  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )
  const project = useAppSelector(selectCurrentProject)

  // Guard: Ensure context is available
  if (!workspace?.id || !project?.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading workspace...</p>
      </div>
    )
  }

  return <BoardListPage workspaceId={workspace.id} projectId={project.id} />
}
