import { InviteButton } from '@/features/invite-member'
import { MemberList } from '@/features/view-members'
import { PendingInviteList } from '@/features/view-invites'
import { useCurrentWorkspace } from '@/entities/workspace/hooks'
import { usePermission } from '@/shared/lib/auth'

export function MembersPage() {
  const currentWorkspace = useCurrentWorkspace()
  const canViewInvites = usePermission('workspace:invite:view')

  if (!currentWorkspace) {
    return (
      <div className="rounded-xl border border-border/40 p-10 text-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Section: Team Members */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage who has access to this workspace.
            </p>
          </div>
          <InviteButton />
        </div>
        <MemberList workspaceId={currentWorkspace.id} />
      </div>

      {/* Section: Pending Invitations — only visible to admins/owners */}
      {canViewInvites && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Pending Invitations</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Users who haven't accepted their invitation yet.
            </p>
          </div>
          <PendingInviteList workspaceId={currentWorkspace.id} />
        </div>
      )}
    </div>
  )
}
