import { ShieldOff } from 'lucide-react'
import { InviteButton } from '@/features/invite-member'
import { MemberList } from '@/features/view-members'
import { PendingInviteList } from '@/features/view-invites'
import { useCurrentWorkspace } from '@/entities/workspace/hooks'
import { useAuthorizationContext, usePermission } from '@/shared/lib/auth'

export function MembersPage() {
  const currentWorkspace = useCurrentWorkspace()
  const { isLoading } = useAuthorizationContext()
  const canReadMembers = usePermission('workspace:member:read')
  const canViewInvites = usePermission('workspace:invite:view')
  const canInvite = usePermission('workspace:member:invite')

  if (!currentWorkspace) {
    return (
      <div className="rounded-xl border border-border/40 p-10 text-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    )
  }

  // Wait for auth context before enforcing — prevents flash of forbidden for members
  if (isLoading) return null

  // Guard: users without workspace:member:read cannot see the member list
  if (!canReadMembers) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="p-3 rounded-full bg-destructive/10">
          <ShieldOff className="h-7 w-7 text-destructive" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            You don't have permission to view workspace members. Contact an Owner or Admin
            to request access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Section: Team Members */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage who has access to this workspace.
            </p>
          </div>
          {canInvite && (
            <div className="w-full sm:w-auto">
              <InviteButton />
            </div>
          )}
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
