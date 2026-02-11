import { gql } from '@/gql'

export const GET_BOARD = gql(`
  query GetBoard($boardId: ID!) {
    getBoard(boardId: $boardId) {
      id
      title
      description
      workspaceId
      projectId
      createdBy
      createdAt
      updatedAt
      isLocked
      isArchived
    }
  }
`)
