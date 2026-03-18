// ── Model ────────────────────────────────────────────────────────────────────
export type {
  Issue,
  IssuePriority,
  IssueUserBasic,
  IssueFilters,
} from './model'

// Redux slice actions (for features to dispatch)
export {
  issuesSlice,
  setStatuses,
  setIssues,
  setLabels,
  addIssue,
  updateIssue,
  removeIssue,
  moveIssue,
  reorderIssue,
  addStatus,
  updateStatus,
  removeStatus,
  reorderStatus,
  setFilters,
  clearFilters,
  removeFilter,
} from './model'
export { issuesReducer } from './model'

// Selectors (for components to use with useAppSelector)
export {
  selectIssueStatuses,
  selectIssues,
  selectIssueLabels,
  selectIssueFilters,
  selectFilteredIssues,
} from './model'

// ── API ──────────────────────────────────────────────────────────────────────
export { ISSUE_CARD_FIELDS, ISSUE_DETAIL_FIELDS } from './api'
export { issueKeys } from './api'

// ── UI atoms ─────────────────────────────────────────────────────────────────
export { PriorityBadge } from './ui'
export { DueDateChip } from './ui'
export { IssueNumber } from './ui'
