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
    <div className="relative group rounded-xl border border-border/40 bg-card/50 p-5 flex flex-col items-center gap-3 hover:border-border/70 hover:bg-card/80 transition-all duration-(--transition-expressive) hover:shadow-lg">
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
      <Avatar className="h-16 w-16 border-2 border-border/40 group-hover:border-primary/20 transition-colors">
        <AvatarImage src={member.user.avatarUrl ?? undefined} />
        <AvatarFallback className="text-xl font-semibold bg-muted">
          {(member.user.fullName ?? member.user.email)[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Name/Email Info */}
      <div className="text-center min-w-0 w-full">
        <p className="text-sm font-semibold text-foreground truncate">
          {member.user.fullName ?? 'Unknown User'}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {member.user.email}
        </p>
      </div>

      {/* Role + joined date */}
      <div className="flex flex-col items-center gap-2 w-full pt-1 border-t border-border/20">
        <MemberRoleCell 
          member={member} 
          workspaceId={workspaceId} 
          actorRank={actorRank} 
          actorUserId={actorUserId} 
        />
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
          Joined {formatDate(member.joinedAt)}
        </p>
      </div>
    </div>
  )
}
