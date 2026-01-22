import { Outlet } from '@tanstack/react-router'
import { WorkspaceErrorState, WorkspaceLoadingState } from './layout-states'
import { useSyncWorkspaceContext } from '@/entities/workspace/hooks'
import { DashboardHeader } from '@/widgets/navigation'

interface WorkspaceLayoutProps {
  workspaceSlug: string
}

export function WorkspaceLayout({ workspaceSlug }: WorkspaceLayoutProps) {
  const { data, isLoading, error } = useSyncWorkspaceContext(workspaceSlug)

  if (isLoading) {
    return <WorkspaceLoadingState />
  }

  if (error || !data?.workspaceBySlug) {
    return <WorkspaceErrorState />
  }

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* TIER 1: GLOBAL HEADER */}
      <div className="shrink-0">
        <DashboardHeader />
      </div>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
