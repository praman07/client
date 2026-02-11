import { gql } from '@/gql'

/**
 * GraphQL mutation for unarchiving a whiteboard board
 */
export const UNARCHIVE_BOARD = gql(`
  mutation UnarchiveBoard($boardId: ID!) {
    unarchiveBoard(boardId: $boardId) {
      id
      isArchived
      updatedAt
    }
  }
`)
