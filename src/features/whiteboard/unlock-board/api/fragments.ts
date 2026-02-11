import { gql } from '@/gql'

/**
 * GraphQL mutation for unlocking a whiteboard board
 */
export const UNLOCK_BOARD = gql(`
  mutation UnlockBoard($boardId: ID!) {
    unlockBoard(boardId: $boardId) {
      id
      isLocked
      updatedAt
    }
  }
`)
