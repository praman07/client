/**
 * Board-level GQL queries — fetches the three datasets needed to render
 * the Kanban board. All use lightweight fragments defined in entities.
 *
 * @layer Widgets
 */
import { gql } from '@/gql'

export const GET_PROJECT_ISSUES = gql(`
  query GetProjectIssues($projectId: ID!) {
    getProjectIssues(projectId: $projectId) {
      ...IssueCardFields
    }
  }
`)

export const GET_ISSUE_STATUSES = gql(`
  query GetIssueStatuses($projectId: ID!) {
    getIssueStatuses(projectId: $projectId) {
      ...IssueStatusFields
    }
  }
`)

export const GET_ISSUE_LABELS = gql(`
  query GetIssueLabels($projectId: ID!) {
    getIssueLabels(projectId: $projectId) {
      ...IssueLabelFields
    }
  }
`)
