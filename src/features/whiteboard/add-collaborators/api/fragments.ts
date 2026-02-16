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
