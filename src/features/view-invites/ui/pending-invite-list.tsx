import { useWorkspaceInvites } from '../hooks'
import { mapInvitesError } from '../lib'
import { InviteRoleBadge } from './invite-role-badge'
import { InviteActionsCell } from './invite-actions-cell'
import type { WorkspaceInvite } from '../model/types'
import type {ColumnDef} from '@/shared/ui';
import { formatDateRelative } from '@/shared/lib/date'
import { usePermission } from '@/shared/lib/auth'
import {  DataTable, DataTableSkeleton } from '@/shared/ui'

interface PendingInviteListProps {
  workspaceId: string
}

export function PendingInviteList({ workspaceId }: PendingInviteListProps) {
  const { data, isLoading, error } = useWorkspaceInvites(workspaceId)
  const canResend = usePermission('workspace:invite:resend')
  const canCancel = usePermission('workspace:invite:cancel')

  const invites = data?.workspaceInvites ?? []

  const columns: Array<ColumnDef<WorkspaceInvite>> = [
    {
      key: 'email',
      header: 'Email',
      render: (invite) => (
        <span className="text-sm text-foreground font-medium">{invite.email}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (invite) => <InviteRoleBadge role={invite.role} />,
    },
    {
      key: 'invitedAt',
      header: 'Invited At',
      cellClassName: 'text-muted-foreground text-xs',
      render: (invite) => formatDateRelative(invite.createdAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right pr-5',
      cellClassName: 'text-right',
      render: (invite) => (
        <InviteActionsCell
          invite={invite}
          workspaceId={workspaceId}
          canResend={canResend}
          canCancel={canCancel}
        />
      ),
    },
  ]

  if (isLoading) {
    return <DataTableSkeleton columnCount={4} rowCount={3} />
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
        <p className="text-sm font-bold text-destructive">Failed to load invitations</p>
        <p className="text-sm text-destructive/80 mt-1">{mapInvitesError(error)}</p>
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      rows={invites}
      rowKey={(inv) => inv.id}
      emptyMessage="No pending invitations. All invites have been accepted or expired."
    />
  )
}
