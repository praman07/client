import type { ReactionGroup } from '../model/types'
import { cn } from '@/shared/lib/utils'

interface ReactionBadgeProps {
  reaction: ReactionGroup
  onClick?: () => void
  className?: string
}

export function ReactionBadge({
  reaction,
  onClick,
  className,
}: ReactionBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium transition-colors border',
        reaction.hasReacted
          ? 'bg-primary/10 border-primary/20 text-primary'
          : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted',
        className,
      )}
    >
      <span>{reaction.emoji}</span>
      <span className="min-w-[1ch] text-center">{reaction.count}</span>
    </button>
  )
}
