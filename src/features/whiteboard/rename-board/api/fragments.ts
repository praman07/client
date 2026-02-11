import { gql } from '@/gql'

/**
 * GraphQL mutation for renaming a whiteboard board
 */
export const RENAME_BOARD = gql(`
  mutation RenameBoard($boardId: ID!, $title: String!) {
    renameBoard(boardId: $boardId, title: $title) {
      id
      title
      updatedAt
    }
  }
`)
