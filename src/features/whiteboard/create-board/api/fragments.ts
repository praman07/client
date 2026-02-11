import { gql } from '@/gql'

/**
 * GraphQL mutation for creating a new whiteboard board
 *
 * Architecture: All GraphQL operations must be defined in api/fragments.ts per FSD FE-04
 */
export const CREATE_BOARD = gql(`
  mutation CreateBoard($input: CreateBoardInput!) {
    createBoard(input: $input) {
      board {
        id
        workspaceId
        projectId
        title
        description
        createdAt
      }
      addedCollaborators {
        userId
        joinedAt
      }
    }
  }
`)
