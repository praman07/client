import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectId/board/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/workspace/$workspaceSlug/project/$projectId/board/"!</div>
}
