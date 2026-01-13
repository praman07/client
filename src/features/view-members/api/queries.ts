import { gql } from '@/gql'

export const GET_WORKSPACE_MEMBERS = gql(`
  query GetWorkspaceMembers($workspaceId: ID!) {
    workspaceMembers(workspaceId: $workspaceId) {
      id
      role
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

export const UPDATE_MEMBER_ROLE = gql(`
  mutation UpdateWorkspaceMemberRole($workspaceId: ID!, $memberId: ID!, $role: String!) {
    updateWorkspaceMemberRole(workspaceId: $workspaceId, memberId: $memberId, role: $role) {
      id
      role
    }
  }
`)

export const REMOVE_MEMBER = gql(`
  mutation RemoveWorkspaceMember($workspaceId: ID!, $memberId: ID!) {
    removeWorkspaceMember(workspaceId: $workspaceId, memberId: $memberId) {
      success
      message
    }
  }
`)
