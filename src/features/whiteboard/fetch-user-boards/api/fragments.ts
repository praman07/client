import { gql } from '@/gql'

export const GET_USER_BOARDS = gql(`
  query GetUserBoards($workspaceId: ID!, $projectId: ID, $limit: Int, $cursor: ID) {
    userBoards(workspaceId: $workspaceId, projectId: $projectId, limit: $limit, cursor: $cursor) {
      boards {
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
      nextCursor
    }
  }
`)
