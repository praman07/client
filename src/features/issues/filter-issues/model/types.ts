import type { IssueFilters } from '@/entities/issue'

/** Which filter category a chip represents — maps to IssueFilters keys */
export type FilterCategory = keyof IssueFilters

/** A single active-filter chip shown in the toolbar */
export interface FilterChip {
  category: FilterCategory
  /** Human-readable summary e.g. "Priority: High, Urgent" */
  label: string
}
