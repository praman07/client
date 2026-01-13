import { createFileRoute } from '@tanstack/react-router'
import { InviteButton } from '@/features/invite-member/ui/invite-button'
import { MemberList } from '@/features/view-members/ui/member-list'
import { useCurrentWorkspace } from '@/entities/session/model/workspace-hooks'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/_main/members',
)({
  component: MembersPage,
})

function MembersPage() {
  const currentWorkspace = useCurrentWorkspace()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
          <p className="text-muted-foreground">
            Manage who has access to this workspace.
          </p>
        </div>
        <InviteButton />
      </div>

      {currentWorkspace ? (
        <MemberList workspaceId={currentWorkspace.id} />
      ) : (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          Loading workspace...
        </div>
      )}
    </div>
  )
}
