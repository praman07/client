import { gql } from '@/gql'

export const CREATE_WORKSPACE_ROLE_MUTATION = gql(`
  mutation CreateWorkspaceRole($workspaceId: ID!, $input: CreateWorkspaceRoleInput!) {
    createWorkspaceRole(workspaceId: $workspaceId, input: $input) {
      id
      name
      rank
      description
      isSystem
      scopeType
    }
  }
`)

export const UPDATE_WORKSPACE_ROLE_MUTATION = gql(`
  mutation UpdateWorkspaceRole($roleId: ID!, $workspaceId: ID!, $input: UpdateWorkspaceRoleInput!) {
    updateWorkspaceRole(roleId: $roleId, workspaceId: $workspaceId, input: $input) {
      id
      name
      rank
      description
      isSystem
      scopeType
    }
  }
`)

export const DELETE_WORKSPACE_ROLE_MUTATION = gql(`
  mutation DeleteWorkspaceRole($roleId: ID!, $workspaceId: ID!) {
    deleteWorkspaceRole(roleId: $roleId, workspaceId: $workspaceId)
  }
`)
