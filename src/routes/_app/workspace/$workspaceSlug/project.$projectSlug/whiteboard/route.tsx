import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch, useUser } from '@/shared/hooks'
import { WhiteboardLayoutSkeleton, RouteError } from '@/shared/ui'
import { createWhiteboardPlugin } from '@/app/providers/ws-domains/whiteboard-plugin'
import { registerPlugin, unregisterPlugin } from '@/shared/ws/domains'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/whiteboard',
)({
  component: WhiteboardLayout,
  pendingComponent: WhiteboardLayoutSkeleton,
  beforeLoad: ({ context }) => {
    const activePlugins: string[] = (context as any)?.project?.activePlugins ?? []
    if (activePlugins.length > 0 && !activePlugins.includes('WHITEBOARD')) {
      throw redirect({ to: '/' as any, search: { pluginDisabled: 'WHITEBOARD' } as any })
    }
  },
  errorComponent: ({ error, reset }) => (
    <RouteError error={error} reset={reset} />
  ),
})

/**
 * Whiteboard Layout
 *
 * Owns the whiteboard WS domain plugin lifecycle — the plugin is only active
 * while the user is inside the /whiteboard route subtree.
 */
function WhiteboardLayout() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { user } = useUser()

  // Stable ref — holds latest userId without triggering re-registration
  const userIdRef = useRef(user?.id ?? null)
  userIdRef.current = user?.id ?? null

  // Plugin lifecycle is tied to route mount/unmount.
  // dispatch and queryClient are stable React references — excluded from deps intentionally.
  // userId is read through a ref so the plugin always sees the current value.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const plugin = createWhiteboardPlugin({
      dispatch,
      queryClient,
      userId: userIdRef.current,
    })
    registerPlugin(plugin)
    return () => unregisterPlugin('whiteboard')
  }, [])

  return <Outlet />
}
