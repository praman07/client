import { gql } from '@/gql'

export const GET_ROLE_PERMISSIONS_QUERY = gql(`
  query GetWorkspaceRolePermissions($roleId: ID!, $workspaceId: ID!) {
    rolePermissions(roleId: $roleId, workspaceId: $workspaceId) {
      roleId
      permissionId
      effect
      conditions
      permission { id resource action description module }
    }
  }
`)

export const GET_ALL_PERMISSIONS_QUERY = gql(`
  query GetAllWorkspacePermissions($workspaceId: ID!) {
    allPermissions(workspaceId: $workspaceId) {
      id
      resource
      action
      description
      module
    }
  }
`)

/**
 * Fetches only workspace-scoped permissions (module = "workspace").
 * Used exclusively by the workspace roles & permissions settings page.
 * Returns 17 permissions covering: workspace core, member, invite, role, settings.
 */
export const GET_WORKSPACE_PERMISSIONS_QUERY = gql(`
  query GetWorkspacePermissions($workspaceId: ID!) {
    workspacePermissions(workspaceId: $workspaceId) {
      id
      resource
      action
      description
      module
    }
  }
`)

export const ASSIGN_ROLE_PERMISSION_MUTATION = gql(`
  mutation AssignWorkspaceRolePermission(
    $roleId: ID!, $workspaceId: ID!, $permissionId: ID!, $effect: String, $conditions: String
  ) {
    assignRolePermission(
      roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId,
      effect: $effect, conditions: $conditions
    ) {
      roleId
      permissionId
      effect
    }
  }
`)

export const REMOVE_ROLE_PERMISSION_MUTATION = gql(`
  mutation RemoveWorkspaceRolePermission($roleId: ID!, $workspaceId: ID!, $permissionId: ID!) {
    removeRolePermission(roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId)
  }
`)
