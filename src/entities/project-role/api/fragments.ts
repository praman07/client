import { gql } from '@/gql'

/**
 * All GQL documents for the project-role entity.
 * - Query docs: consumed by entity hooks (useQuery)
 * - Mutation docs: imported by features/manage-project-roles (useMutation)
 *
 * @layer Entity
 */

export const PROJECT_ROLE_FIELDS = gql(`
  fragment ProjectRoleFields on ProjectRole {
    id
    name
    rank
    description
    isSystem
    scopeType
  }
`)

export const ROLE_PERMISSION_FIELDS = gql(`
  fragment RolePermissionFields on RolePermission {
    roleId
    permissionId
    effect
    conditions
    permission {
      id
      resource
      action
      description
      module
    }
  }
`)

// ── Queries ───────────────────────────────────────────────────────────────────

export const GET_PROJECT_ROLES = gql(`
  query GetProjectRoles($projectId: ID!, $workspaceId: ID!) {
    projectRoles(projectId: $projectId, workspaceId: $workspaceId) {
      ...ProjectRoleFields
    }
  }
`)

export const GET_ROLE_PERMISSIONS = gql(`
  query GetRolePermissions($roleId: ID!, $workspaceId: ID!) {
    rolePermissions(roleId: $roleId, workspaceId: $workspaceId) {
      ...RolePermissionFields
    }
  }
`)

export const GET_ALL_PERMISSIONS = gql(`
  query GetAllPermissions($workspaceId: ID!) {
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
 * Fetches project-scoped permissions (module = "project") for the roles & permissions matrix.
 * Used by useProjectPermissionsCatalog on the project settings Roles tab.
 */
export const GET_PROJECT_PERMISSIONS = gql(`
  query GetProjectPermissions($workspaceId: ID!, $projectId: ID!) {
    projectPermissions(workspaceId: $workspaceId, projectId: $projectId) {
      id
      resource
      action
      description
      module
    }
  }
`)

// ── Mutations (imported by features/manage-project-roles) ─────────────────────

export const CREATE_PROJECT_ROLE = gql(`
  mutation CreateProjectRole(
    $projectId: ID!
    $workspaceId: ID!
    $input: CreateProjectRoleInput!
  ) {
    createProjectRole(
      projectId: $projectId
      workspaceId: $workspaceId
      input: $input
    ) {
      ...ProjectRoleFields
    }
  }
`)

export const UPDATE_PROJECT_ROLE = gql(`
  mutation UpdateProjectRole(
    $roleId: ID!
    $projectId: ID!
    $workspaceId: ID!
    $input: UpdateProjectRoleInput!
  ) {
    updateProjectRole(
      roleId: $roleId
      projectId: $projectId
      workspaceId: $workspaceId
      input: $input
    ) {
      ...ProjectRoleFields
    }
  }
`)

export const DELETE_PROJECT_ROLE = gql(`
  mutation DeleteProjectRole($roleId: ID!, $projectId: ID!, $workspaceId: ID!) {
    deleteProjectRole(roleId: $roleId, projectId: $projectId, workspaceId: $workspaceId)
  }
`)

export const ASSIGN_ROLE_PERMISSION = gql(`
  mutation AssignRolePermission(
    $roleId: ID!
    $workspaceId: ID!
    $permissionId: ID!
    $effect: String!
    $conditions: String
  ) {
    assignRolePermission(
      roleId: $roleId
      workspaceId: $workspaceId
      permissionId: $permissionId
      effect: $effect
      conditions: $conditions
    ) {
      ...RolePermissionFields
    }
  }
`)

export const REMOVE_ROLE_PERMISSION = gql(`
  mutation RemoveRolePermission($roleId: ID!, $workspaceId: ID!, $permissionId: ID!) {
    removeRolePermission(roleId: $roleId, workspaceId: $workspaceId, permissionId: $permissionId)
  }
`)
