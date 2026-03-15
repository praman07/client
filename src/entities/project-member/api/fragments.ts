import { gql } from '@/gql'

/**
 * All GQL documents for the project-member entity.
 * - Query docs: consumed by entity hooks (useQuery)
 * - Mutation docs: imported by features/manage-project-members (useMutation)
 *
 * @layer Entity
 */

export const PROJECT_MEMBER_FIELDS = gql(`
  fragment ProjectMemberFields on ProjectMember {
    id
    userId
    role
    joinedAt
    user {
      id
      fullName
      email
      avatarUrl
    }
  }
`)

// ── Query ─────────────────────────────────────────────────────────────────────

export const GET_PROJECT_MEMBERS = gql(`
  query GetProjectMembers($projectId: ID!) {
    projectMembers(projectId: $projectId) {
      ...ProjectMemberFields
    }
  }
`)

// ── Mutations (imported by features/manage-project-members) ───────────────────

export const ADD_PROJECT_MEMBER = gql(`
  mutation AddProjectMember($projectId: ID!, $workspaceId: ID!, $userId: ID!) {
    addProjectMember(projectId: $projectId, workspaceId: $workspaceId, userId: $userId) {
      ...ProjectMemberFields
    }
  }
`)

export const REMOVE_PROJECT_MEMBER = gql(`
  mutation RemoveProjectMember($projectId: ID!, $workspaceId: ID!, $userId: ID!) {
    removeProjectMember(projectId: $projectId, workspaceId: $workspaceId, userId: $userId)
  }
`)

export const UPDATE_PROJECT_MEMBER_ROLE = gql(`
  mutation UpdateProjectMemberRole($projectId: ID!, $workspaceId: ID!, $userId: ID!, $roleId: ID!) {
    updateProjectMemberRole(projectId: $projectId, workspaceId: $workspaceId, userId: $userId, roleId: $roleId) {
      ...ProjectMemberFields
    }
  }
`)

export const LEAVE_PROJECT = gql(`
  mutation LeaveProject($projectId: ID!) {
    leaveProject(projectId: $projectId)
  }
`)
