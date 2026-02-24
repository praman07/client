import { gql } from '@/gql'

export const ADD_PAGE_COLLABORATORS = gql(`
  mutation AddPageCollaborators($input: AddPageCollaboratorsInput!) {
    addPageCollaborators(input: $input) {
      addedCollaborators {
        userId
        role
        user {
          id
          fullName
          avatarUrl
        }
      }
    }
  }
`)
