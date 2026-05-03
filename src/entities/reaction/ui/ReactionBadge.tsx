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
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-11 font-medium transition-colors border',
        reaction.hasReacted
          ? 'bg-accent-subtle border-accent-subtle text-primary'
          : 'bg-layer-2 border-transparent text-secondary hover:bg-layer-2-hover',
        className,
      )}
    >
      <span>{reaction.emoji}</span>
      <span className="min-w-[1ch] text-center">{reaction.count}</span>
    </button>
  )
}
