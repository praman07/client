import { gql } from '@/gql'

export const GET_PROJECT_DMS = gql(`
  query GetProjectDms($projectId: ID!, $workspaceId: ID!) {
    getProjectDms(projectId: $projectId, workspaceId: $workspaceId) {
      id
      otherUser {
        id
        fullName
        avatarUrl
      }
      unreadCount
      updatedAt
    }
  }
`)
