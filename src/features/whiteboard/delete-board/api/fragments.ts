import { gql } from '@/gql'

/**
 * GraphQL mutation for deleting a whiteboard board
 */
export const DELETE_BOARD = gql(`
  mutation DeleteBoard($boardId: ID!) {
    deleteBoard(boardId: $boardId) {
      success
      boardId
    }
  }
`)
