import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { PagesEditorPage } from '@/pages/pages'
import { PageSpinner, PagesSkeleton, RouteError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId',
)({
  component: PagesEditorRoute,
  pendingComponent: PagesSkeleton,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function PagesEditorRoute() {
  const { pageId } = Route.useParams()

  return (
    <ErrorBoundary FallbackComponent={({ error, resetErrorBoundary }) => (
      <RouteError error={error} reset={resetErrorBoundary} />
    )}>
      <Suspense fallback={<PageSpinner />}>
        <PagesEditorPage key={pageId} pageId={pageId} />
      </Suspense>
    </ErrorBoundary>
  )
}
