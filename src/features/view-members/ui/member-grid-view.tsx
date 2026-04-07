import { UserX } from 'lucide-react'
import { MemberGridCard } from './member-grid-card'
import type { WorkspaceMember } from '../model/types'

interface MemberGridViewProps {
  members: Array<WorkspaceMember>
  workspaceId: string
  actorRank: number
  actorUserId: string
  search: string
}

/**
 * MemberGridView
 * 
 * Renders a grid of member cards.
 * Handles empty states for search results and initial loading.
 */
export function MemberGridView({
  members,
  workspaceId,
  actorRank,
  actorUserId,
  search,
}: MemberGridViewProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4 bg-card/10 rounded-xl border border-dashed border-border/40">
        <div className="p-4 bg-muted/20 rounded-full border border-border/40">
          <UserX className="h-10 w-10 opacity-30" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground">No members found</p>
          <p className="text-xs max-w-[240px] leading-relaxed italic">
            {search ? (
              <>No members match your search "<span className="text-foreground not-italic font-medium">{search}</span>"</>
            ) : (
              'This workspace does not have any members yet.'
            )}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {members.map((member, i) => (
        <MemberGridCard
          key={member.id}
          member={member}
          workspaceId={workspaceId}
          actorRank={actorRank}
          actorUserId={actorUserId}
        />
      ))}
    </div>
  )
}
