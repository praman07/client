import { gql } from '@/gql'

/**
 * Moves an issue to a different status column (cross-column drag).
 * Server resolver: moveIssueStatus
 * @layer Features
 */
export const MOVE_ISSUE_STATUS = gql(`
  mutation MoveIssueStatus($input: MoveIssueStatusInput!) {
    moveIssueStatus(input: $input) {
      issue {
        ...IssueCardFields
      }
    }
  }
`)

/**
 * Reorders an issue within its current column (same-column drag).
 * Server resolver: reorderIssue
 * @layer Features
 */
export const REORDER_ISSUE = gql(`
  mutation ReorderIssue($input: ReorderIssueInput!) {
    reorderIssue(input: $input) {
      issue {
        ...IssueCardFields
      }
    }
  }
`)
