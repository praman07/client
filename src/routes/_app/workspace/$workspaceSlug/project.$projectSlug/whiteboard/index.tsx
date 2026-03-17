import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BoardListPage } from '@/pages/whiteboard'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'
import { BoardListSkeleton, PageSpinner, RouteError, WidgetError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/whiteboard/',
)({
  component: WhiteboardIndexRoute,
  pendingComponent: BoardListSkeleton,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function WhiteboardIndexRoute() {
  const { workspaceSlug } = Route.useParams()

  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )
  const project = useAppSelector(selectCurrentProject)

  if (!workspace?.id || !project?.id) {
    return <PageSpinner label="Loading workspace…" />
  }

  return (
    <ErrorBoundary FallbackComponent={WidgetError}>
      <Suspense fallback={<BoardListSkeleton />}>
        <BoardListPage workspaceId={workspace.id} projectId={project.id} />
      </Suspense>
    </ErrorBoundary>
  )
}
