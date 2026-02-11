import { gql } from '@/gql'

export const GET_BOARD = gql(`
  query GetBoard($id: ID!) {
    board(id: $id) {
      id
      workspaceId
      projectId
      title
      description
      elementCount
      fileSizeBytes
      isArchived
      isLocked
      createdBy
      createdAt
      updatedAt
    }
  }
`)
