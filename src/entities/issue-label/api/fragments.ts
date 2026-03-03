import { gql } from '@/gql'

/**
 * Core label fields — used by getIssueLabels and embedded
 * in every Issue's labels array.
 *
 * @layer Entity
 */
export const ISSUE_LABEL_FIELDS = gql(`
  fragment IssueLabelFields on IssueLabel {
    id
    projectId
    name
    color
    createdAt
  }
`)
