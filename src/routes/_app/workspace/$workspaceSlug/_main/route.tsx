import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { WORKSPACE_TABS } from '@/shared/config/navigation'
import { NavTabs } from '@/widgets/navigation'
import { PageSpinner, RouteError  } from '@/shared/ui'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main')({
  component: WorkspaceMainLayout,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function WorkspaceMainLayout() {
  return (
    <>
      <div className="border-b bg-background px-6">
        <NavTabs items={WORKSPACE_TABS as any} from={Route.fullPath} />
      </div>
      <main className="flex-1 overflow-auto bg-background p-6">
        <ErrorBoundary FallbackComponent={({ error, resetErrorBoundary }) => (
          <RouteError error={error} reset={resetErrorBoundary} />
        )}>
          <Suspense fallback={<PageSpinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  )
}
