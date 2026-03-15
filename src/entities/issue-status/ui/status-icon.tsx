/**
 * Maps an icon-key string stored in the DB to the corresponding Lucide icon,
 * rendered in the status color.
 *
 * System icon key → Lucide icon mapping:
 *   "circle-dashed" → CircleDashed  (Backlog)
 *   "circle"        → Circle        (Todo)
 *   "circle-half"   → CircleHalf    (In Progress)
 *   "circle-dot"    → CircleDot     (In Review)
 *   "check-circle"  → CheckCircle   (Done)
 *   "x-circle"      → XCircle       (Canceled)
 *
 * Unknown keys fall back to Circle.
 *
 * Used in:
 *  - entities/issue-status/ui/status-pill.tsx
 *  - widgets/issues-board/ui/issue-column-header.tsx
 *
 * @layer Entity
 */
import {
  CircleDashed,
  Circle,
  Clock,
  CircleDot,
  CheckCircle,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const ICON_MAP: Record<string, LucideIcon> = {
  'circle-dashed': CircleDashed,
  circle: Circle,
  'circle-half': Clock, // In Progress — Clock is the closest semantic match
  'circle-dot': CircleDot,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
}

interface StatusIconProps {
  iconKey: string | null
  /** Hex color string, e.g. "#6B7280" */
  color: string
  /** Icon size in px. Default: 14 */
  size?: number
  className?: string
}

export function StatusIcon({
  iconKey,
  color,
  size = 14,
  className,
}: StatusIconProps) {
  const Icon = iconKey ? (ICON_MAP[iconKey] ?? Circle) : Circle

  return (
    <Icon
      style={{ width: size, height: size, color }}
      className={cn('shrink-0', className)}
    />
  )
}
