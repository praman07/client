import { gql } from '@/gql'

export const REMOVE_BOARD_COLLABORATOR = gql(`
  mutation RemoveBoardCollaborator($boardId: ID!, $userId: ID!) {
    removeBoardCollaborator(boardId: $boardId, userId: $userId) {
      success
    }
  }
`)
