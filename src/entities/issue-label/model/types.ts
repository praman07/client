/**
 * IssueLabel entity types.
 * Labels are project-scoped tags applied to issues by users.
 *
 * Labels persist across all issues in a project and are reused
 * via the IssueToLabel join table on the backend.
 *
 * @layer Entity
 */

export interface IssueLabel {
  id: string
  projectId: string
  name: string
  /** Hex color string, e.g. "#EF4444" — used for the label pill badge */
  color: string
  createdAt: string
}
