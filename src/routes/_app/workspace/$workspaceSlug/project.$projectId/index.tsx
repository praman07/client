import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/project/$projectId/')({
  component: ProjectOverview,
})

function ProjectOverview() {
  const { projectId } = Route.useParams()
  return <div className="p-8 text-2xl font-bold">Project Overview: {projectId}</div>
}
