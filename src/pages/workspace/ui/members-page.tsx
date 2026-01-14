import { InviteButton } from '@/features/invite-member'
import { MemberList } from '@/features/view-members'
import { useCurrentWorkspace } from '@/entities/workspace/hooks'

export function MembersPage() {
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
