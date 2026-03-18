import { gql } from '@/gql'

/**
 * GQL operations for edit-issue feature.
 * All ID arguments use ID! type as defined in the GraphQL schema.
 * @layer Features
 */

export const GET_ISSUE = gql(`
  query GetIssue($issueId: ID!) {
    getIssue(issueId: $issueId) {
      ...IssueDetailFields
    }
  }
`)

export const GET_ISSUE_DESCRIPTION_URL = gql(`
  query GetIssueDescriptionUrl($issueId: ID!) {
    getIssueDescriptionUrl(issueId: $issueId) {
      url
    }
  }
`)

export const UPDATE_ISSUE = gql(`
  mutation UpdateIssue($input: UpdateIssueInput!) {
    updateIssue(input: $input) {
      issue {
        ...IssueDetailFields
      }
    }
  }
`)

export const DELETE_ISSUE = gql(`
  mutation DeleteIssue($input: DeleteIssueInput!) {
    deleteIssue(input: $input) {
      success
    }
  }
`)

export const REQUEST_ISSUE_DESCRIPTION_UPLOAD = gql(`
  mutation RequestIssueDescriptionUpload($input: RequestIssueDescriptionUploadInput!) {
    requestIssueDescriptionUpload(input: $input) {
      presignedUrl
      descriptionFileId
    }
  }
`)

export const CONFIRM_ISSUE_DESCRIPTION_UPLOAD = gql(`
  mutation ConfirmIssueDescriptionUpload($input: ConfirmIssueDescriptionUploadInput!) {
    confirmIssueDescriptionUpload(input: $input) {
      issue {
        ...IssueDetailFields
      }
    }
  }
`)
