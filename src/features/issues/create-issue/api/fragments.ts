import { gql } from '@/gql'

/**
 * Creates a new issue in a project.
 * Server resolver: createIssue
 * @layer Features
 */
export const CREATE_ISSUE = gql(`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      issue {
        id
        ...IssueCardFields
      }
    }
  }
`)
