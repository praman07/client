import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui'
import { DataTable, type ColumnDef } from '@/shared/ui'
import { MemberRoleCell } from './member-role-cell'
import { MemberActionsMenu } from './member-actions-menu'
import { formatDate } from '@/shared/lib/date'
import type { WorkspaceMember } from '../model/types'

interface MemberTableViewProps {
  members: WorkspaceMember[]
  workspaceId: string
  actorRank: number
  actorUserId: string
  search: string
}

export function MemberTableView({
  members,
  workspaceId,
  actorRank,
  actorUserId,
  search,
}: MemberTableViewProps) {
  const columns: ColumnDef<WorkspaceMember>[] = [
    {
      key: 'user',
      header: 'User',
      headerClassName: 'w-[260px]',
      render: (member) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0 border border-border/40">
            <AvatarImage src={member.user.avatarUrl ?? undefined} />
            <AvatarFallback className="text-[11px] font-bold bg-muted text-muted-foreground">
              {(member.user.fullName ?? member.user.email)[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="truncate text-sm font-semibold text-foreground tracking-tight">
            {member.user.fullName ?? 'Unknown User'}
          </p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      cellClassName: 'text-muted-foreground',
      render: (member) => (
        <span className="line-clamp-1">{member.user.email}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (member) => (
        <MemberRoleCell
          member={member}
          workspaceId={workspaceId}
          actorRank={actorRank}
          actorUserId={actorUserId}
        />
      ),
    },
    {
      key: 'joinedAt',
      header: 'Joined At',
      cellClassName: 'text-muted-foreground text-xs',
      render: (member) => formatDate(member.joinedAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right pr-4',
      cellClassName: 'text-right pr-4',
      render: (member) => (
        <MemberActionsMenu
          member={member}
          workspaceId={workspaceId}
          actorRank={actorRank}
          actorUserId={actorUserId}
        />
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={members}
      rowKey={(m) => m.id}
      search={search}
      emptyMessage="No members found in this workspace."
      emptySearchMessage={`No members match "${search}"`}
    />
  )
}
