import { gql } from '@/gql'

/**
 * GraphQL mutation for archiving a whiteboard board
 */
export const ARCHIVE_BOARD = gql(`
  mutation ArchiveBoard($boardId: ID!) {
    archiveBoard(boardId: $boardId) {
      id
      isArchived
      updatedAt
    }
  }
`)
