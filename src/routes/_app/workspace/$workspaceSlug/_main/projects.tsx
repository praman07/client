import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '@/pages/workspace'
import { PageSpinner, RouteError  } from '@/shared/ui'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/_main/projects',
)({
  component: ProjectsRouteComponent,
  pendingComponent: PageSpinner,
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

function ProjectsRouteComponent() {
  const { workspaceSlug } = Route.useParams()
  return <ProjectsPage workspaceSlug={workspaceSlug} />
}
