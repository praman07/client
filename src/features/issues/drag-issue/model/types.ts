import type { IssuePriority } from '@/entities/issue'

/**
 * Payload for a cross-column drag operation (moveIssueStatus).
 * @layer Features
 */
export interface DragIssuePayload {
  issueId: string
  sourceStatusId: string
  targetStatusId: string
  newPosition: number
  /** Original position in the source column — used to revert optimistic update on error */
  previousPosition: number
}

/**
 * Payload for a same-column reorder operation (reorderIssue).
 * @layer Features
 */
export interface ReorderIssuePayload {
  issueId: string
  newPosition: number
  priority?: IssuePriority
}
