import { MemberRoleCell } from './member-role-cell'
import { MemberActionsMenu } from './member-actions-menu'
import type { WorkspaceMember } from '../model/types'
import type {ColumnDef} from '@/shared/ui';
import { Avatar, AvatarFallback, AvatarImage,  DataTable  } from '@/shared/ui'
import { formatDate } from '@/shared/lib/date'

interface MemberTableViewProps {
  members: Array<WorkspaceMember>
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
  const columns: Array<ColumnDef<WorkspaceMember>> = [
    {
      key: 'user',
      header: 'User',
      headerClassName: 'w-[260px]',
      render: (member) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0 border border-subtle">
            <AvatarImage src={member.user.avatarUrl ?? undefined} />
            <AvatarFallback className="text-11 font-bold bg-layer-2 text-secondary">
              {(member.user.fullName ?? member.user.email)[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="truncate text-14 font-semibold text-primary tracking-tight">
            {member.user.fullName ?? 'Unknown User'}
          </p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      cellClassName: 'text-secondary',
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
      cellClassName: 'text-secondary text-11',
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
