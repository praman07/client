import { Card, Avatar, AvatarFallback, AvatarImage, Button } from '@/shared/ui'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { useWorkspaceOverview } from '@/entities/workspace/hooks'
import { Link, useParams } from '@tanstack/react-router'

function WorkspaceMembersSkeleton() {
  return (
    <Card className="flex flex-col p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex items-center -space-x-3 py-1 mb-6 px-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="w-10 h-10 rounded-full border-2 border-background shrink-0" />
        ))}
      </div>
      <Skeleton className="w-full h-9 rounded-md" />
    </Card>
  )
}

export function WorkspaceMembersWidget() {
  const { data, isLoading } = useWorkspaceOverview()
  const { workspaceSlug } = useParams({ strict: false })

  if (isLoading) return <WorkspaceMembersSkeleton />

  const overview = data?.workspaceOverview
  const members = overview?.recentMembers ?? []
  const totalMembers = overview?.totalMembers ?? 0
  const overflowCount = Math.max(0, totalMembers - members.length)

  return (
    <Card className="flex flex-col p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-foreground tracking-tight">Workspace Members</h3>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          {totalMembers} Total
        </span>
      </div>

      <div className="flex items-center -space-x-3 py-1 mb-6 px-1">
        {members.map((member) => (
          <Avatar
            key={member.userId}
            className="w-10 h-10 border-2 border-background hover:-translate-y-1 hover:z-10 transition-all cursor-pointer shadow-sm relative"
          >
            {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.fullName ?? member.email} />}
            <AvatarFallback>
              {(member.fullName ?? member.email).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {overflowCount > 0 && (
          <div className="relative z-0 flex items-center justify-center w-10 h-10 rounded-full border-2 border-background bg-surface-2 shadow-sm text-[11px] text-foreground font-mono font-medium hover:-translate-y-1 hover:z-10 transition-all cursor-pointer">
            +{overflowCount}
          </div>
        )}
      </div>

      <Button
        variant="outline"
        className="w-full h-9 font-medium shadow-none bg-surface-2 border-border/40 hover:bg-surface-2/80 hover:text-foreground text-muted-foreground transition-colors"
        asChild
      >
        <Link
          to="/workspace/$workspaceSlug/members"
          params={{ workspaceSlug: workspaceSlug! }}
        >
          View Members
        </Link>
      </Button>
    </Card>
  )
}
