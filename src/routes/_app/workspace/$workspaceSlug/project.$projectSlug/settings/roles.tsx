import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { selectCurrentWorkspace } from '@/entities/workspace'
import { PageSpinner, RouteError, ScrollArea, WidgetError } from '@/shared/ui'
import { ProjectRolesPanel } from '@/widgets/project-roles-panel'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/settings/roles',
)({
  component: ProjectRolesSettingsPage,
  pendingComponent: PageSpinner,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function ProjectRolesSettingsPage() {
  const project = useAppSelector(selectCurrentProject)
  const workspace = useAppSelector(selectCurrentWorkspace)

  if (!project || !workspace) return <PageSpinner label="Loading project…" />

  return (
    <ErrorBoundary FallbackComponent={WidgetError}>
      <ScrollArea className="h-[calc(100vh-320px)]">
        <ProjectRolesPanel projectId={project.id} workspaceId={workspace.id} />
      </ScrollArea>
    </ErrorBoundary>
  )
}
