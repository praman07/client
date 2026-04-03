import { gql } from '@/gql'

export const WORKSPACE_FRAGMENT = gql(`
  fragment WorkspaceFragment on Workspace {
    id
    name
    slug
    logoUrl
    memberRole
  }
`)

export const GET_WORKSPACE_OVERVIEW_QUERY = gql(`
  query GetWorkspaceOverview($workspaceId: ID!) {
    workspaceOverview(workspaceId: $workspaceId) {
      totalProjects
      totalMembers
      totalIssues
      totalPages
      totalChannels
      activeProjects {
        id
        name
        key
        description
        memberCount
        openIssues
        updatedAt
      }
      recentMembers {
        userId
        fullName
        email
        avatarUrl
        roleName
        joinedAt
      }
    }
  }
`)
