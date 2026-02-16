import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/whiteboard',
)({
  component: WhiteboardLayout,
})

/**
 * Whiteboard Layout
 *
 * Container for whiteboard routes (list and individual boards)
 */
function WhiteboardLayout() {
  return <Outlet />
}
