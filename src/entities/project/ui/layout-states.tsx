import { Link } from '@tanstack/react-router'
import { Button, Spinner } from '@/shared/ui'

export function ProjectLoadingState() {
  return (
    <div className="flex bg-layer-transparent h-screen w-full items-center justify-center">
      <Spinner className="size-6 text-tertiary" />
    </div>
  )
}

interface ProjectErrorStateProps {
  workspaceSlug?: string
}

export function ProjectErrorState({ workspaceSlug }: ProjectErrorStateProps) {
  return (
    <div className="flex bg-layer-transparent h-screen w-full flex-col items-center justify-center gap-4">
      <div className="space-y-2 text-center">
        <h1 className="text-20 font-semibold text-primary tracking-tight">
          Project not found
        </h1>
        <p className="text-13 text-secondary max-w-[300px]">
          The project you are looking for does not exist or you do not have
          permission to view it.
        </p>
      </div>

      {workspaceSlug && (
        <Button asChild variant="outline">
          <Link to="/workspace/$workspaceSlug" params={{ workspaceSlug }}>
            Return to Workspace
          </Link>
        </Button>
      )}
    </div>
  )
}
