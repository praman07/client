import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/kanban',
)({
  component: BoardLayout,
  beforeLoad: ({ context }) => {
    const activePlugins: string[] = (context as any)?.project?.activePlugins ?? []
    if (activePlugins.length > 0 && !activePlugins.includes('ISSUES')) {
      throw redirect({ to: '/' as any, search: { pluginDisabled: 'ISSUES' } as any })
    }
  },
})

function BoardLayout() {
  return <Outlet />
}
