import { Link, useNavigate } from '@tanstack/react-router'
import { Add01Icon, Folder01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/shared/ui/primitives/button'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { WorkspaceCard } from '@/entities/workspace'
import type { WorkspaceFragmentFragment } from '@/gql/graphql'

export interface RecentWorkspacesProps {
  workspaces: WorkspaceFragmentFragment[]
  isLoading: boolean
}

export function RecentWorkspaces({ workspaces, isLoading }: RecentWorkspacesProps) {
  const navigate = useNavigate()

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Recent Workspaces</h2>
        {!isLoading && workspaces.length > 0 && (
          <Link to="/user/workspaces" className="text-xs text-primary font-medium hover:underline">
            View all
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center max-w-2xl mx-auto w-full">
          <HugeiconsIcon icon={Folder01Icon} className="size-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No workspaces yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1 mb-4">Create your first workspace to start collaborating</p>
          <Button size="sm" onClick={() => void navigate({ to: '/workspace/new' })} className="gap-1.5">
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
            Create workspace
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws.id} workspace={ws} />
          ))}
        </div>
      )}
    </section>
  )
}
