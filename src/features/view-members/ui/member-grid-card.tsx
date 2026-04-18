import { MemberRoleCell } from './member-role-cell'
import { MemberActionsMenu } from './member-actions-menu'
import type { WorkspaceMember } from '../model/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui'
import { formatDate } from '@/shared/lib/date'
import { cn } from '@/shared/lib/utils'

interface MemberGridCardProps {
  member: WorkspaceMember
  workspaceId: string
  actorRank: number
  actorUserId: string
}

/**
 * MemberGridCard
 * 
 * Displays a member card for the Grid view mode.
 * Features a large avatar, member info, role badge, and actions menu.
 */
export function MemberGridCard({
  member,
  workspaceId,
  actorRank,
  actorUserId,
}: MemberGridCardProps) {
  return (
    <div className="relative group rounded-xl border border-subtle bg-layer-1 p-5 flex flex-col items-center gap-3 hover:border-subtle hover:bg-layer-1-hover transition-all duration-[--transition-expressive] hover:shadow-lg">
      {/* Actions menu — top-right absolute */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <MemberActionsMenu 
          member={member} 
          workspaceId={workspaceId} 
          actorRank={actorRank} 
          actorUserId={actorUserId} 
        />
      </div>

      {/* Avatar — large */}
      <Avatar className="h-16 w-16 border-2 border-subtle group-hover:border-accent-subtle transition-colors">
        <AvatarImage src={member.user.avatarUrl ?? undefined} />
        <AvatarFallback className="text-xl font-semibold bg-layer-2">
          {(member.user.fullName ?? member.user.email)[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Name/Email Info */}
      <div className="text-center min-w-0 w-full">
        <p className="text-14 font-semibold text-primary truncate">
          {member.user.fullName ?? 'Unknown User'}
        </p>
        <p className="text-11 text-tertiary truncate mt-0.5">
          {member.user.email}
        </p>
      </div>

      {/* Role + joined date */}
      <div className="flex flex-col items-center gap-2 w-full pt-1 border-t border-subtle">
        <MemberRoleCell 
          member={member} 
          workspaceId={workspaceId} 
          actorRank={actorRank} 
          actorUserId={actorUserId} 
        />
        <p className="text-10 text-tertiary/60 uppercase tracking-widest font-medium">
          Joined {formatDate(member.joinedAt)}
        </p>
      </div>
    </div>
  )
}
