import { useNavigate } from '@tanstack/react-router'
import { Plus, Folder, UserPlus } from 'lucide-react'
import { useMyWorkspaces } from '@/entities/workspace/hooks/use-my-workspaces'
import { WorkspaceCard } from '@/entities/workspace'
import { Button } from '@/shared/ui/primitives/button'
import { Skeleton } from '@/shared/ui/primitives/skeleton'

export function UserWorkspacesPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useMyWorkspaces()

  const workspaces = (data?.myWorkspaces ?? []) as Array<any>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-20 sm:text-24 font-bold tracking-tight">Workspaces</h1>
          <p className="text-13 sm:text-14 text-secondary mt-1">All your workspaces.</p>
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-subtle py-16 text-center max-w-2xl mx-auto w-full">
          <Folder className="size-10 text-tertiary mb-3" />
          <p className="text-13 font-medium text-secondary">No workspaces yet</p>
          <p className="text-11 text-tertiary mt-1 mb-4">Create your first workspace to start collaborating</p>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => void navigate({ to: '/workspace/new' })}
          >
            <Plus className="size-4" />
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
