import { Outlet } from '@tanstack/react-router'
import { WorkspaceErrorState, WorkspaceLoadingState } from './layout-states'
import { useSyncCurrentWorkspace } from '@/entities/session/lib/use-session-sync'
import { DashboardHeader } from '@/widgets/navigation'

interface WorkspaceLayoutProps {
  workspaceSlug: string
}

export function WorkspaceLayout({ workspaceSlug }: WorkspaceLayoutProps) {
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
