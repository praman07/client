import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { selectCurrentWorkspace } from '@/entities/workspace'
import { ProjectRolesList } from '@/widgets/project-roles-list'
import { PageSpinner, RouteError, WidgetError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/settings/roles',
)({
  component: RolesSettingsPage,
  pendingComponent: PageSpinner,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function RolesSettingsPage() {
  const project = useAppSelector(selectCurrentProject)
  const workspace = useAppSelector(selectCurrentWorkspace)

  // PageSpinner handles Redux sync wait — never returns silently null
  if (!project || !workspace) return <PageSpinner label="Loading project…" />

  return (
    <ErrorBoundary FallbackComponent={WidgetError}>
      <ProjectRolesList projectId={project.id} workspaceId={workspace.id} />
    </ErrorBoundary>
  )
}
