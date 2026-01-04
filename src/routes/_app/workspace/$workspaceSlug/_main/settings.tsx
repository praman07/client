import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/_main/settings',
)({
  component: () => <div className="text-xl">Workspace Settings</div>,
})
