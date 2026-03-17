import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BoardViewPage } from '@/pages/whiteboard'
import { PageSpinner, RouteError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/whiteboard/$boardId',
)({
  component: WhiteboardBoardRoute,
  pendingComponent: PageSpinner,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function WhiteboardBoardRoute() {
  const { boardId, workspaceSlug, projectSlug } = Route.useParams()

  return (
    <ErrorBoundary FallbackComponent={({ error, resetErrorBoundary }) => (
      <RouteError error={error} reset={resetErrorBoundary} />
    )}>
      <Suspense fallback={<PageSpinner />}>
        <BoardViewPage
          boardId={boardId}
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
        />
      </Suspense>
    </ErrorBoundary>
  )
}
