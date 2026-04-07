import React from 'react'
import { Calendar } from 'lucide-react'
import { differenceInCalendarDays, isPast, isToday, parseISO, isValid } from 'date-fns'
import { cn } from '@/shared/lib/utils'

interface UpcomingIssue {
  id: string
  number: number
  title: string
  dueDate: string
  assigneeName?: string | null
  assigneeAvatar?: string | null
  statusName: string
  statusColor: string
}

interface UpcomingDeadlinesProps {
  issues: UpcomingIssue[]
}

interface DueDateDisplay {
  label: string
  className: string
}

const getDueDateDisplay = (dateStr: string): DueDateDisplay | null => {
  if (!dateStr) return null
  const date = parseISO(dateStr)
  if (!isValid(date)) return null

  if (isToday(date)) {
    return { label: 'TODAY', className: 'text-red-500 font-bold text-xs' }
  }
  if (isPast(date)) {
    return { label: 'OVERDUE', className: 'text-red-500 font-bold text-xs' }
  }
  const days = differenceInCalendarDays(date, new Date())
  if (days === 1) {
    return { label: 'Tomorrow', className: 'text-muted-foreground text-xs' }
  }
  return { label: `${days}d`, className: 'text-muted-foreground text-xs' }
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ issues }) => {
  return (
    <div className="h-full bg-card border border-border rounded-xl p-5 flex flex-col">
      <h3 className="text-sm font-bold text-foreground mb-4">Upcoming Deadlines</h3>

      {issues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
          <Calendar className="h-5 w-5 text-muted-foreground/30" />
          <p className="text-[11px] text-muted-foreground">No upcoming deadlines</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {issues.map((issue) => {
            const due = getDueDateDisplay(issue.dueDate)

            return (
              <div
                key={issue.id}
                className="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0 group cursor-default"
              >
                {/* Issue number badge — fixed indigo, matches design */}
                <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/15 text-indigo-400">
                  #{issue.number}
                </span>

                {/* Title */}
                <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">
                  {issue.title}
                </p>

                {/* Due date label — right aligned */}
                {due && (
                  <span className={cn('shrink-0 tabular-nums', due.className)}>
                    {due.label}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
