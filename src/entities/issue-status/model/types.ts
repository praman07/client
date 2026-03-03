/**
 * IssueStatus entity types.
 * Represents a Kanban column — project-scoped, user-managed.
 *
 * Six system statuses are seeded on project creation and cannot be deleted.
 * Name / color / icon are still editable on system statuses.
 *
 * @layer Entity
 */

/** Icon keys for the six system statuses seeded on project creation */
export const SYSTEM_STATUS_ICONS = {
  BACKLOG: 'circle-dashed',
  TODO: 'circle',
  IN_PROGRESS: 'circle-half',
  IN_REVIEW: 'circle-dot',
  DONE: 'check-circle',
  CANCELED: 'x-circle',
} as const

export type SystemStatusIconKey =
  (typeof SYSTEM_STATUS_ICONS)[keyof typeof SYSTEM_STATUS_ICONS]

export interface IssueStatus {
  id: string
  projectId: string
  name: string
  /** Hex color string, e.g. "#6B7280" — used for the column header pill and status icon */
  color: string
  /**
   * Icon key string mapping to a Lucide icon via StatusIcon component.
   * null = no icon (custom user-created columns may omit an icon).
   */
  icon: string | null
  /** Fractional index — drives column order in the Kanban board */
  position: number
  /**
   * When true: cannot be deleted.
   * System statuses: Backlog, Todo, In Progress, In Review, Done, Canceled.
   * Name / color / icon remain editable.
   */
  isSystem: boolean
  /** Count of non-deleted issues in this column — shown in the column header badge */
  issueCount: number
}
