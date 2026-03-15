/**
 * Displays an issue's priority as a colored icon with an optional text label.
 *
 * Used in:
 *  - widgets/issues-board/ui/issue-card.tsx            (icon only — showLabel=false)
 *  - features/issues/edit-issue/ui/edit-issue-sidebar.tsx  (icon + label)
 *  - features/issues/create-issue/ui/create-issue-form.tsx (icon + label in picker)
 *  - features/issues/filter-issues/ui/issue-filter-toolbar.tsx
 *
 * @layer Entity
 */
import { AlertCircle, ArrowUp, Equal, ArrowDown, Minus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { IssuePriority } from '../model/types'
import type { LucideIcon } from 'lucide-react'

interface PriorityConfig {
  icon: LucideIcon
  label: string
  className: string
}

const PRIORITY_CONFIG: Record<IssuePriority, PriorityConfig> = {
  URGENT: { icon: AlertCircle, label: 'Urgent', className: 'text-red-500' },
  HIGH: { icon: ArrowUp, label: 'High', className: 'text-orange-500' },
  MEDIUM: { icon: Equal, label: 'Medium', className: 'text-yellow-500' },
  LOW: { icon: ArrowDown, label: 'Low', className: 'text-slate-400' },
  NO_PRIORITY: {
    icon: Minus,
    label: 'No Priority',
    className: 'text-muted-foreground',
  },
}

interface PriorityBadgeProps {
  priority: IssuePriority
  /** Show text label alongside the icon. Default: false (icon only) */
  showLabel?: boolean
  /** Icon size in px. Default: 14 */
  size?: number
  className?: string
}

export function PriorityBadge({
  priority,
  showLabel = false,
  size = 14,
  className,
}: PriorityBadgeProps) {
  const { icon: Icon, label, className: colorClass } = PRIORITY_CONFIG[priority]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 shrink-0',
        colorClass,
        className,
      )}
    >
      <Icon style={{ width: size, height: size }} />
      {showLabel && <span className="text-xs font-medium">{label}</span>}
    </span>
  )
}
