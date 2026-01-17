import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/',
)({
  component: ProjectOverview,
})

function ProjectOverview() {
  const { projectSlug } = Route.useParams()
  return (
    <div className="p-8 text-2xl font-bold">
      Project Overview: {projectSlug}
    </div>
  )
}
