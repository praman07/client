import { gql } from '@/gql'

export const GET_WORKSPACE_MEMBERS = gql(`
  query GetWorkspaceMembers($workspaceId: ID!) {
    workspaceMembers(workspaceId: $workspaceId) {
      id
      role
      roleId
      roleRank
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
  mutation UpdateWorkspaceMemberRole($workspaceId: ID!, $memberId: ID!, $roleId: ID!) {
    updateWorkspaceMemberRole(workspaceId: $workspaceId, memberId: $memberId, roleId: $roleId) {
      id
      role
      roleId
      roleRank
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

