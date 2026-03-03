import { gql } from '@/gql'

/**
 * GQL mutations for column (status) management.
 * Server resolvers: createIssueStatus, updateIssueStatus, reorderIssueStatus, deleteIssueStatus
 * @layer Features
 */
export const CREATE_ISSUE_STATUS = gql(`
  mutation CreateIssueStatus($input: CreateIssueStatusInput!) {
    createIssueStatus(input: $input) {
      status {
        ...IssueStatusFields
      }
    }
  }
`)

export const UPDATE_ISSUE_STATUS = gql(`
  mutation UpdateIssueStatus($input: UpdateIssueStatusInput!) {
    updateIssueStatus(input: $input) {
      status {
        ...IssueStatusFields
      }
    }
  }
`)

export const REORDER_ISSUE_STATUS = gql(`
  mutation ReorderIssueStatus($input: ReorderIssueStatusInput!) {
    reorderIssueStatus(input: $input) {
      status {
        ...IssueStatusFields
      }
    }
  }
`)

export const DELETE_ISSUE_STATUS = gql(`
  mutation DeleteIssueStatus($input: DeleteIssueStatusInput!) {
    deleteIssueStatus(input: $input) {
      success
    }
  }
`)
