import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { Skeleton } from '@/shared/ui/primitives/skeleton'

interface ContributorStats {
  userId: string
  name: string
  avatarUrl?: string | null
  assigned: number
  completed: number
}

interface ContributorActivityProps {
  stats: Array<ContributorStats>
  loading?: boolean
}

const ContributorCard: React.FC<{ contributor: ContributorStats }> = ({ contributor }) => {
  const isOnline = contributor.assigned > 0

  return (
    <div className="flex-1 min-w-[140px] bg-card border border-border rounded-xl px-4 py-4 flex flex-col items-start gap-3 relative overflow-hidden">
      {/* Online / active indicator */}
      {isOnline && (
        <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-orange-400" />
      )}

      <Avatar className="h-10 w-10 border-2 border-border">
        <AvatarImage src={contributor.avatarUrl || ''} alt={contributor.name} />
        <AvatarFallback className="bg-muted text-sm font-bold">
          {contributor.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="w-full min-w-0">
        <p className="text-[13px] font-semibold text-foreground leading-tight truncate">
          {contributor.name}
        </p>
        <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
          {contributor.completed} CLOSED
        </p>
      </div>
    </div>
  )
}

export const ContributorActivity: React.FC<ContributorActivityProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 h-28 rounded-xl" />
        ))}
      </div>
    )
  }

  if (stats.length === 0) {
    return (
      <div className="py-6 border-2 border-dashed border-border rounded-xl flex items-center justify-center">
        <p className="text-[11px] text-muted-foreground">No contributors yet</p>
      </div>
    )
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {stats.map((contributor) => (
        <ContributorCard key={contributor.userId} contributor={contributor} />
      ))}
    </div>
  )
}
