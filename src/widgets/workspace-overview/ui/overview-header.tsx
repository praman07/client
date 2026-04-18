import { Button } from '@/shared/ui'
import { Guard } from '@/shared/lib/auth/guard'
import { useCreateProjectModal } from '@/features/project/create-project'
import { useInviteMemberModal } from '@/features/invite-member'

export function OverviewHeader() {
  const { open: openCreateProject } = useCreateProjectModal()
  const { open: openInvite } = useInviteMemberModal()

  return (
<div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between pb-6">
    <div>
      <h1 className="text-24 font-semibold tracking-tight text-primary">Overview</h1>
      <p className="text-secondary mt-1 text-14">
        Manage your high-velocity projects and team collaboration.
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <Guard permission="workspace:member:invite">
        <Button
          variant="outline"
          className="h-9 px-4 font-medium border border-subtle"
          onClick={openInvite}
        >
          Invite Members
        </Button>
      </Guard>
      <Guard permission="project:create">
        <Button
          className="h-9 px-4 shadow-raised-100 bg-accent-primary text-on-color hover:bg-accent-primary-hover font-medium"
          onClick={openCreateProject}
        >
          Create Project
        </Button>
      </Guard>
    </div>
  </div>
  )
}
