import { gql } from '@/gql'

export const GET_BOARD_COLLABORATORS = gql(`
  query GetBoardCollaborators($boardId: ID!) {
    boardCollaborators(boardId: $boardId) {
      userId
      joinedAt
      user {
        id
        fullName
        email
        avatarUrl
      }
    }
  }
`)
