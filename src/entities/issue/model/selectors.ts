/**
 * Selectors for the issues Redux slice.
 * Typed against the store shape so they can be used with useAppSelector.
 *
 * @layer Entity
 */
import type { Issue, IssueFilters, IssuePriority } from './types'
import type { IssueStatus } from '@/entities/issue-status'
import type { IssueLabel } from '@/entities/issue-label'

// Hoisted outside selector — creating this inside the fn allocates a new
// object on every selector call, wasting memory and GC time.
const PRIORITY_ORDER: Record<IssuePriority, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  NO_PRIORITY: 4,
}

interface IssuesStateShape {
  issues: {
    statuses: IssueStatus[]
    issues: Issue[]
    labels: IssueLabel[]
    filters: IssueFilters
  }
}

/** All statuses (columns) sorted by position */
export const selectIssueStatuses = (state: IssuesStateShape) =>
  state.issues.statuses

/** All issues for the current project (unfiltered) */
export const selectIssues = (state: IssuesStateShape) => state.issues.issues

/** All project-scoped labels */
export const selectIssueLabels = (state: IssuesStateShape) =>
  state.issues.labels

/** Current board filter state */
export const selectIssueFilters = (state: IssuesStateShape) =>
  state.issues.filters

/** Issues filtered by the active filter state — computed client-side */
export const selectFilteredIssues = (state: IssuesStateShape): Issue[] => {
  const { issues, filters } = state.issues

  const filtered = issues.filter((issue) => {
    // Status filter (whitelist of column IDs)
    if (
      filters.statusIds?.length &&
      !filters.statusIds.includes(issue.status.id)
    )
      return false

    // Assignee filter (multi-select; 'unassigned' sentinel handled by empty string)
    if (filters.assigneeIds?.length) {
      const assigneeId = issue.assignee?.id ?? 'unassigned'
      if (!filters.assigneeIds.includes(assigneeId)) return false
    }

    // Priority filter (multi-select)
    if (
      filters.priorities?.length &&
      !filters.priorities.includes(issue.priority)
    )
      return false

    // Labels filter (issue must have ALL selected labels)
    if (filters.labelIds?.length) {
      const issueLabelIds = issue.labels.map((l) => l.id)
      if (!filters.labelIds.every((id) => issueLabelIds.includes(id)))
        return false
    }

    // Due date filter
    if (filters.dueDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const endOfWeek = new Date(today)
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()))

      if (filters.dueDate === 'no-date' && issue.dueDate !== null) return false
      if (filters.dueDate !== 'no-date' && issue.dueDate === null) return false

      if (issue.dueDate) {
        const due = new Date(issue.dueDate)
        if (filters.dueDate === 'overdue' && due >= today) return false
        if (
          filters.dueDate === 'today' &&
          due.toDateString() !== today.toDateString()
        )
          return false
        if (filters.dueDate === 'this-week' && (due < today || due > endOfWeek))
          return false
      }
    }

    return true
  })

  // Sort: URGENT → HIGH → MEDIUM → LOW → NO_PRIORITY, then by position.
  // Uses module-level PRIORITY_ORDER (hoisted) to avoid object allocation per call.
  return filtered.sort((a, b) => {
    const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    return pd !== 0 ? pd : a.position - b.position
  })
}
