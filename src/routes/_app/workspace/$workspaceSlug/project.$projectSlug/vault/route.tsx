import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/vault',
)({
  component: VaultLayout,
  beforeLoad: ({ context }) => {
    const activePlugins: string[] = (context as any)?.project?.activePlugins ?? []
    if (activePlugins.length > 0 && !activePlugins.includes('VAULT')) {
      throw redirect({ to: '/' as any, search: { pluginDisabled: 'VAULT' } as any })
    }
  },
})

/**
 * Vault Layout
 *
 * Container for vault routes — passes through to child routes.
 */
function VaultLayout() {
  return <Outlet />
}
