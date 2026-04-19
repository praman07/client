import { Outlet } from '@tanstack/react-router'
import { WorkspaceErrorState } from './workspace-error-state'
import { useSyncWorkspaceContext, useWorkspaceContextSwitch } from '@/entities/workspace/hooks'
import { DashboardHeader } from '@/widgets/navigation'
import { Spinner } from '@/shared/ui/primitives/spinner'

interface WorkspaceLayoutProps {
  workspaceSlug: string
}

export function WorkspaceLayout({ workspaceSlug }: WorkspaceLayoutProps) {
  // Fire synchronously before child routes render.
  // If the slug changed, purges stale workspace-scoped cache immediately.
  useWorkspaceContextSwitch(workspaceSlug)

  const { data, isLoading, error } = useSyncWorkspaceContext(workspaceSlug)

  return (
    <div className="h-screen w-full bg-surface-1 flex flex-col overflow-hidden">
      {/* TIER 1: GLOBAL HEADER */}
      <div className="shrink-0">
        <DashboardHeader />
      </div>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
            <Spinner className="size-8 text-secondary" />
          </div>
        ) : error || !data?.workspaceBySlug ? (
          <WorkspaceErrorState />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}
