import { gql } from '@/gql'

/**
 * GraphQL mutation for locking a whiteboard board
 */
export const LOCK_BOARD = gql(`
  mutation LockBoard($boardId: ID!) {
    lockBoard(boardId: $boardId) {
      id
      isLocked
      updatedAt
    }
  }
`)
