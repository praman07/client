/**
 * Issue entity types.
 * Derived from the Issue GraphQL type (issues schema.graphql).
 *
 * @layer Entity
 */

import type { IssueStatus } from '@/entities/issue-status'
import type { IssueLabel } from '@/entities/issue-label'

/** Priority enum — DB sort order: URGENT (top) → NO_PRIORITY (bottom) */
export type IssuePriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NO_PRIORITY'

/** Minimal user shape embedded in every issue (assignee, createdBy) */
export interface IssueUserBasic {
  id: string
  fullName: string
  avatarUrl: string | null
}

/** A single issue card on the Kanban board */
export interface Issue {
  id: string
  projectId: string
  workspaceId: string

  /**
   * Sequential per-project integer.
   * Display as: `${project.key}-${issue.number}` — e.g. "PROJ-42"
   */
  number: number

  title: string

  /**
   * S3 key of the latest ACTIVE description file.
   * null = no description saved yet → render empty BlockNote editor.
   * NOT the presigned URL — always call getIssueDescriptionUrl to get a fresh URL.
   */
  descriptionS3Key: string | null

  status: IssueStatus
  priority: IssuePriority

  /**
   * Fractional index for ordering within a status column.
   * Primary sort: priority (URGENT first). Secondary sort: position ASC.
   */
  position: number

  /** null = unassigned */
  assignee: IssueUserBasic | null

  labels: IssueLabel[]

  /** ISO datetime string. null = no due date set */
  dueDate: string | null

  createdBy: IssueUserBasic
  createdAt: string
  updatedAt: string
}

/** Active filter state for the board toolbar (client-side only) */
export interface IssueFilters {
  /** Filter to one or more status column IDs */
  statusIds?: string[]
  /** Filter to one or more assignee user IDs (empty array = unassigned only) */
  assigneeIds?: string[]
  /** Filter to one or more priority levels */
  priorities?: IssuePriority[]
  /** Issue must have ALL of these label IDs to pass the filter */
  labelIds?: string[]
  /** Due-date preset filter */
  dueDate?: 'overdue' | 'today' | 'this-week' | 'no-date'
}
