import { gql } from '@/gql'

export const REMOVE_PAGE_COLLABORATOR = gql(`
  mutation RemovePageCollaborator($input: RemovePageCollaboratorInput!) {
    removePageCollaborator(input: $input) {
      success
    }
  }
`)
