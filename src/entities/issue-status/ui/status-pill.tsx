/**
 * Compact status display: colored icon + name side by side.
 *
 * Used as the trigger/display element inside status selector popovers and
 * anywhere a status needs to be shown in a single line.
 *
 * Used in:
 *  - features/issues/create-issue/ui/create-issue-form.tsx  (status selector trigger)
 *  - features/issues/edit-issue/ui/edit-issue-sidebar.tsx   (status display + trigger)
 *  - widgets/issues-board/ui/issue-column-header.tsx        (column header)
 *
 * @layer Entity
 */
import { StatusIcon } from './status-icon'
import type { IssueStatus } from '../model/types'
import { cn } from '@/shared/lib/utils'

interface StatusPillProps {
  status: IssueStatus
  /** Show the status name alongside the icon. Default: true */
  showName?: boolean
  /** Icon size in px. Default: 14 */
  iconSize?: number
  className?: string
}

export function StatusPill({
  status,
  showName = true,
  iconSize = 14,
  className,
}: StatusPillProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-13', className)}>
      <StatusIcon iconKey={status.icon} color={status.color} size={iconSize} />
      {showName && <span className="truncate">{status.name}</span>}
    </span>
  )
}
