import { gql } from '@/gql'

export const GET_ACTIVE_COLLABORATORS = gql(`
  query GetActiveCollaborators($boardId: ID!) {
    activeCollaborators(boardId: $boardId) {
      userId
      connectionId
      joinedAt
      lastSeenAt
      cursorPosition {
        x
        y
      }
    }
  }
`)
