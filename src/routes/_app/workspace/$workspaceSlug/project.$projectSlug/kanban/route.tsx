import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/kanban',
)({
  component: BoardLayout,
})

function BoardLayout() {
  return (
    <Outlet />
  )
}
