import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Add01Icon, Folder01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useMyWorkspaces } from '@/entities/workspace/hooks/use-my-workspaces'
import { WorkspaceCard } from '@/entities/workspace'
import { Button } from '@/shared/ui/primitives/button'
import { Skeleton } from '@/shared/ui/primitives/skeleton'

export function UserWorkspacesPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useMyWorkspaces()

  const workspaces = (data?.myWorkspaces ?? []) as any[]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">All workspaces you are a member of.</p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => void navigate({ to: '/workspace/new' })}
        >
          <Plus className="h-4 w-4" />
          Create Workspace
        </Button>
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
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => void navigate({ to: '/workspace/new' })}
          >
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
    </div>
  )
}
