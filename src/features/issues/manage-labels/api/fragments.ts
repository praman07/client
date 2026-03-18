import { gql } from '@/gql'

/**
 * GQL mutations for label management.
 * Server resolvers: createIssueLabel, updateIssueLabel, deleteIssueLabel
 * @layer Features
 */
export const CREATE_ISSUE_LABEL = gql(`
  mutation CreateIssueLabel($input: CreateIssueLabelInput!) {
    createIssueLabel(input: $input) {
      label {
        ...IssueLabelFields
      }
    }
  }
`)

export const UPDATE_ISSUE_LABEL = gql(`
  mutation UpdateIssueLabel($input: UpdateIssueLabelInput!) {
    updateIssueLabel(input: $input) {
      label {
        ...IssueLabelFields
      }
    }
  }
`)

export const DELETE_ISSUE_LABEL = gql(`
  mutation DeleteIssueLabel($input: DeleteIssueLabelInput!) {
    deleteIssueLabel(input: $input) {
      success
    }
  }
`)
