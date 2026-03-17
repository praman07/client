import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { PageSpinner, RouteError , ScrollArea  } from '@/shared/ui'
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
    <ScrollArea className="h-full w-full">
      <div className="max-w-4xl mx-auto px-6 py-8 min-h-full">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage this project's configuration and access.
          </p>
        </div>

        <ProjectSettingsTabs
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
        >
          <ErrorBoundary FallbackComponent={({ error, resetErrorBoundary }) => (
            <RouteError error={error} reset={resetErrorBoundary} />
          )}>
            <Suspense fallback={<PageSpinner />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </ProjectSettingsTabs>
      </div>
    </ScrollArea>
  )
}
