import { Outlet, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RouteError } from '@/shared/ui/error/route-error'
import { DashboardHeader } from '@/widgets/navigation/ui/dashboard-header'
import { WorkspaceSwitcher } from '@/widgets/navigation/ui/workspace-switcher'

import { useSyncCurrentWorkspace } from '@/entities/session/lib/use-session-sync'
import {
  WorkspaceErrorState,
  WorkspaceLoadingState,
} from '@/widgets/workspace/ui/workspace-layout-states'

const workspaceSearchSchema = z.object({
  action: z.enum(['create-project']).optional(),
})

export const Route = createFileRoute('/_app/workspace/$workspaceSlug')({
  component: WorkspaceLayout,
  errorComponent: RouteError,
  validateSearch: (search) => workspaceSearchSchema.parse(search),
  loader: async () => {
    return null
  },
  staticData: {
    breadcrumb: () => <WorkspaceSwitcher />,
  },
})

function WorkspaceLayout() {
  const { workspaceSlug } = Route.useParams()
  const { data, isLoading, error } = useSyncCurrentWorkspace(workspaceSlug)

  if (isLoading) {
    return <WorkspaceLoadingState />
  }

  if (error || !data?.workspaceBySlug) {
    return <WorkspaceErrorState />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TIER 1: GLOBAL HEADER */}
      <DashboardHeader />

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
