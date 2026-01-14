import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '@/pages/workspace'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/_main/projects',
)({
  component: ProjectsRouteComponent,
})

function ProjectsRouteComponent() {
  const { workspaceSlug } = Route.useParams()
  return <ProjectsPage workspaceSlug={workspaceSlug} />
}
