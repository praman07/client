import { gql } from '@/gql'

/**
 * GraphQL mutation for updating board description
 */
export const UPDATE_BOARD_DESCRIPTION = gql(`
  mutation UpdateBoardDescription($boardId: ID!, $description: String) {
    updateBoardDescription(boardId: $boardId, description: $description) {
      id
      description
      updatedAt
    }
  }
`)
