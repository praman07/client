import React from 'react'
import { UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { Link, useParams } from '@tanstack/react-router'

interface Member {
  userId: string
  name: string
  avatarUrl?: string | null | undefined
  roleName?: string | null | undefined
  roleRank?: number | null | undefined
}

interface Channel {
  id: string
  name: string
  topic?: string | null
}

interface ActiveMembersProps {
  members: Member[]
  totalCount: number
  channels?: Channel[]
}

export const ActiveMembers: React.FC<ActiveMembersProps> = ({
  members,
  totalCount,
  channels = [],
}) => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  const MANAGER_RANKS = [1, 2] // roleRank 1 = Owner, 2 = Admin
  const managerCount = members.filter(
    (m) => m.roleRank != null && MANAGER_RANKS.includes(m.roleRank),
  ).length
  const contributorCount = totalCount - managerCount

  const visibleMembers = members.slice(0, 5)
  const overflowCount = totalCount - visibleMembers.length

  return (
    <div className="h-full bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Team</h3>
        <Link
          to="/workspace/$workspaceSlug/project/$projectSlug/settings/members"
          params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '' }}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Invite
        </Link>
      </div>

      {/* Avatar stack */}
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {visibleMembers.map((member) => (
            <Avatar
              key={member.userId}
              className="h-8 w-8 border-2 border-card ring-0"
            >
              <AvatarImage src={member.avatarUrl || ''} alt={member.name} />
              <AvatarFallback className="bg-muted text-[11px] font-bold">
                {member.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {overflowCount > 0 && (
            <div className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
              +{overflowCount}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <p className="text-[12px] text-muted-foreground leading-relaxed">
        {managerCount > 0 && (
          <>
            <span className="font-semibold text-foreground">{managerCount}</span>{' '}
            {managerCount === 1 ? 'Manager' : 'Managers'},{' '}
          </>
        )}
        <span className="font-semibold text-foreground">{contributorCount}</span>{' '}
        {contributorCount === 1 ? 'Contributor' : 'Contributors'} active in this project context.
      </p>

      {/* Channels preview */}
      {channels.length > 0 && (
        <div className="mt-auto space-y-2 pt-3 border-t border-border">
          {channels.slice(0, 2).map((ch) => (
            <Link
              key={ch.id}
              to="/workspace/$workspaceSlug/project/$projectSlug/chat/$conversationId"
              params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '', conversationId: ch.id }}
              className="flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:bg-emerald-400 transition-colors" />
              <span className="flex-1 min-w-0 truncate">{ch.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
