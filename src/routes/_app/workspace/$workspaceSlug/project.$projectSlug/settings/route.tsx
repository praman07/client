import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { PageSpinner, RouteError } from '@/shared/ui'
import { ProjectSettingsTabs } from '@/widgets/project-settings-tabs'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/settings',
)({
  component: SettingsLayout,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
  beforeLoad: ({ location }) => {
    if (location.pathname.endsWith('/settings')) {
      throw redirect({
        to: location.pathname + '/general',
        replace: true,
      })
    }
  },
})

function SettingsLayout() {
  const { workspaceSlug, projectSlug } = Route.useParams()

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-7xl w-full px-6 py-8 lg:px-8">
        <ProjectSettingsTabs workspaceSlug={workspaceSlug} projectSlug={projectSlug}>
          <ErrorBoundary FallbackComponent={({ error, resetErrorBoundary }) => (
            <RouteError error={error} reset={resetErrorBoundary} />
          )}>
            <Suspense fallback={<PageSpinner />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </ProjectSettingsTabs>
      </div>
    </div>
  )
}
