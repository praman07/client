/**
 * Colored pill badge for a label: e.g. "● Bug"
 *
 * Uses a semi-transparent fill derived from label.color so the badge
 * is legible on both light and dark backgrounds without hard-coding themes.
 *
 * Props:
 *   - label   — the IssueLabel object
 *   - dotOnly — render only a colored dot (no text). Useful in tight card rows.
 *
 * Used in:
 *  - widgets/issues-board/ui/issue-card.tsx
 *  - features/issues/edit-issue/ui/edit-issue-sidebar.tsx
 *  - features/issues/filter-issues/ui/issue-filter-toolbar.tsx
 *  - features/issues/manage-labels/ui/label-list-row.tsx
 *
 * @layer Entity
 */
import { cn } from '@/shared/lib/utils'
import type { IssueLabel } from '../model/types'

interface LabelPillProps {
  label: IssueLabel
  /** Render only the color dot — no name text. Default: false */
  dotOnly?: boolean
  className?: string
}

export function LabelPill({ label, dotOnly = false, className }: LabelPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        className,
      )}
      style={{
        backgroundColor: `${label.color}1F`, // ~12 % opacity fill
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: `${label.color}60`,     // ~38 % opacity border
        color: label.color,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: label.color }}
      />
      {!dotOnly && label.name}
    </span>
  )
}
