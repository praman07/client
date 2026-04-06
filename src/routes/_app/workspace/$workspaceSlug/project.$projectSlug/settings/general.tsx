import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentWorkspace } from '@/entities/workspace'
import { ProjectGeneralSettings } from '@/widgets/project-general-settings'
import { RouteError, SettingsSkeleton, WidgetError } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/settings/general',
)({
  component: GeneralSettingsPage,
  pendingComponent: SettingsSkeleton,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function GeneralSettingsPage() {
  const { workspaceSlug, projectSlug } = Route.useParams()
  const workspace = useAppSelector(selectCurrentWorkspace)

  if (!workspace) return <SettingsSkeleton />

  return (
    <ErrorBoundary FallbackComponent={WidgetError}>
      <ProjectGeneralSettings
        workspaceId={workspace.id}
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
      />
    </ErrorBoundary>
  )
}
