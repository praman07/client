import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/kanban/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Project Kanban Board</div>
}
