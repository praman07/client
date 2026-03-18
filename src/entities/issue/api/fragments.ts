import { gql } from '@/gql'

/**
 * Lightweight card fields — used by getProjectIssues (board load).
 * Keeps the network payload small; does NOT include descriptionS3Key.
 *
 * @layer Entity
 */
export const ISSUE_CARD_FIELDS = gql(`
  fragment IssueCardFields on Issue {
    id
    number
    title
    priority
    position
    dueDate
    updatedAt
    status {
      id
      name
      color
      icon
    }
    assignee {
      id
      fullName
      avatarUrl
    }
    labels {
      id
      name
      color
    }
  }
`)

/**
 * Full detail fields — used by getIssue (edit modal).
 * Extends IssueCardFields with description S3 key + creator metadata.
 *
 * @layer Entity
 */
export const ISSUE_DETAIL_FIELDS = gql(`
  fragment IssueDetailFields on Issue {
    ...IssueCardFields
    descriptionS3Key
    createdBy {
      id
      fullName
      avatarUrl
    }
    createdAt
  }
`)
