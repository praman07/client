/**
 * Renders the human-readable issue identifier: e.g. "PROJ-42".
 * Combines the project key (stored on Project model) with the
 * sequential issue number (stored on Issue model).
 *
 * Used in:
 *  - widgets/issues-board/ui/issue-card.tsx
 *  - features/issues/edit-issue/ui/edit-issue-header.tsx
 *
 * @layer Entity
 */
import { cn } from '@/shared/lib/utils'

interface IssueNumberProps {
  /** Project key, e.g. "PROJ" — stored as Project.key in the DB */
  projectKey: string
  /** Sequential int per project (e.g. 42) */
  number: number
  className?: string
}

export function IssueNumber({
  projectKey,
  number,
  className,
}: IssueNumberProps) {
  return (
    <span
      className={cn(
        'font-mono text-12 text-tertiary select-none shrink-0',
        className,
      )}
    >
      {projectKey}-{number}
    </span>
  )
}
