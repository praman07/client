/**
 * Renders an issue due date as a compact chip.
 * Text turns red when the date is in the past (overdue).
 *
 * Used in:
 *  - widgets/issues-board/ui/issue-card.tsx
 *  - features/issues/edit-issue/ui/edit-issue-sidebar.tsx
 *
 * @layer Entity
 */
import { format, isPast, isValid, parseISO } from 'date-fns'
import { CalendarClock } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface DueDateChipProps {
  /** ISO datetime string from GraphQL */
  dueDate: string
  className?: string
}

export function DueDateChip({ dueDate, className }: DueDateChipProps) {
  if (!dueDate) return null
  const date = parseISO(dueDate)
  if (!isValid(date)) return null // guards unparseable strings
  if (date.getFullYear() < 2000) return null // guards epoch/min-date DB artifacts

  const overdue = isPast(date)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs',
        overdue ? 'text-red-500' : 'text-muted-foreground',
        className,
      )}
    >
      <CalendarClock className="h-3 w-3 shrink-0" />
      {format(date, 'MMM d')}
    </span>
  )
}
