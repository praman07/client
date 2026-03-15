import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ProjectSettingsTabs } from '@/widgets/project-settings-tabs'
import { ScrollArea } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/settings',
)({
  component: SettingsLayout,
  beforeLoad: ({ location }) => {
    // Redirect bare /settings to /settings/general
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
        {/* Page header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage this project's configuration and access.
          </p>
        </div>

        {/* Sidebar + content — same width as header */}
        <ProjectSettingsTabs
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
        >
          <Outlet />
        </ProjectSettingsTabs>
      </div>
    </ScrollArea>
  )
}
