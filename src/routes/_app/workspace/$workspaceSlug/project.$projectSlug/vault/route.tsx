import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/vault',
)({
  component: VaultLayout,
})

/**
 * Vault Layout
 *
 * Container for vault routes — passes through to child routes.
 */
function VaultLayout() {
  return <Outlet />
}
