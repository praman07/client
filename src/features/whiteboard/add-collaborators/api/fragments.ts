import { gql } from '@/gql'

export const ADD_BOARD_COLLABORATORS = gql(`
  mutation AddBoardCollaborators($boardId: ID!, $userIds: [ID!]!) {
    addBoardCollaborators(boardId: $boardId, userIds: $userIds) {
      success
      addedCount
      skippedCount
    }
  }
`)
