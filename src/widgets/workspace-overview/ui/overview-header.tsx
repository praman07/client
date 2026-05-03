import { Button } from '@/shared/ui'
import { Guard } from '@/shared/lib/auth/guard'
import { useCreateProjectModal } from '@/features/project/create-project'
import { useInviteMemberModal } from '@/features/invite-member'

export function OverviewHeader() {
  const { open: openCreateProject } = useCreateProjectModal()
  const { open: openInvite } = useInviteMemberModal()

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
      <div>
        <h1 className="text-20 font-semibold tracking-tight text-primary">
          Good morning
        </h1>
        <p className="text-12 text-secondary mt-0.5">
          Here's what's happening in your workspace.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Guard permission="workspace:member:invite">
          <Button
            variant="outline"
            className="h-8 px-3 text-13 font-medium border border-subtle text-primary hover:bg-layer-1-hover"
            onClick={openInvite}
          >
            Invite Members
          </Button>
        </Guard>
        <Guard permission="project:create">
          <Button
            className="h-8 px-3 text-13 font-medium bg-accent-primary hover:bg-accent-primary-hover text-on-color rounded-md transition-colors"
            onClick={openCreateProject}
          >
            Create Project
          </Button>
        </Guard>
      </div>
    </div>
  )
}