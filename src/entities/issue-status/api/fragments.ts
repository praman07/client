import { gql } from '@/gql'

/**
 * Core column fields — used by getIssueStatuses and embedded
 * in every Issue's status sub-object.
 *
 * @layer Entity
 */
export const ISSUE_STATUS_FIELDS = gql(`
  fragment IssueStatusFields on IssueStatus {
    id
    projectId
    name
    color
    icon
    position
    isSystem
    issueCount
  }
`)
