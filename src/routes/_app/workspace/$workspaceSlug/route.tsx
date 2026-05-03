import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { RouteError } from '@/shared/ui'
import { WorkspaceLayout } from '@/pages/workspace'
import { WorkspaceSwitcher } from '@/widgets/navigation'
import { useSocketConnection } from '@/app/providers/socket-connection.provider'
import { useAppDispatch, useUser } from '@/shared/hooks'
import { createNotificationPlugin } from '@/app/providers/ws-domains/notification-plugin'
import { registerPlugin, unregisterPlugin } from '@/shared/ws/domains'

const workspaceSearchSchema = z.object({
  action: z.enum(['create-project']).optional(),
})

export const Route = createFileRoute('/_app/workspace/$workspaceSlug')({
  component: WorkspaceLayoutRouteComponent,
  errorComponent: RouteError,
  validateSearch: (search) => workspaceSearchSchema.parse(search),
  staticData: {
    breadcrumb: () => <WorkspaceSwitcher />,
  },
})

function WorkspaceLayoutRouteComponent() {
  const { workspaceSlug } = Route.useParams()
  const dispatch = useAppDispatch()
  const { user } = useUser()

  // Stable refs — always hold the latest value without triggering re-registration
  const userRef = useRef(user)
  const workspaceSlugRef = useRef(workspaceSlug)
  useEffect(() => {
    userRef.current = user
    workspaceSlugRef.current = workspaceSlug
  }, [user, workspaceSlug])

  // Plugin lifecycle is tied to route mount/unmount
  useEffect(() => {
    const plugin = createNotificationPlugin({
      dispatch,
      getCurrentUserId: () => userRef.current?.id ?? null,
      getCurrentWorkspaceSlug: () => workspaceSlugRef.current,
    })
    registerPlugin(plugin)
    return () => unregisterPlugin('notification')
  }, [dispatch])

  // Initialize Global Socket & Events Scoped to Workspace
  // This hook handles the detailed connection logic non-blocking.
  useSocketConnection(true)

  return (
    <>
      <WorkspaceLayout workspaceSlug={workspaceSlug} />
    </>
  )
}
