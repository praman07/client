import { gql } from '@/gql'

export const PROJECT_FRAGMENT = gql(`
  fragment ProjectFields on Project {
    id
    key
    name
    description
    workspaceId
    isArchived
    isPrivate
    logoUrl
    activePlugins
    createdAt
    updatedAt
    members {
      userId
      role
      joinedAt
      user {
        id
        fullName
        avatarUrl
      }
    }
  }
`)

export const GET_PROJECT = gql(`
  query GetProject($id: ID!) {
    project(id: $id) {
      ...ProjectFields
    }
  }
`)

export const LIST_PROJECTS_BY_USER = gql(`
  query MyProjects($workspaceId: ID!) {
    myProjects(workspaceId: $workspaceId) {
      ...ProjectFields
    }
  }
`)

export const GET_PROJECT_BY_SLUG = gql(`
  query GetProjectBySlug($workspaceId: ID!, $slug: String!) {
    projectBySlug(workspaceId: $workspaceId, slug: $slug) {
      ...ProjectFields
    }
  }
`)

// ── Overview (dashboard) ──────────────────────────────────────────────────────

export const GET_PROJECT_OVERVIEW = gql(`
  query GetProjectOverview($projectId: ID!) {
    projectOverview(projectId: $projectId) {
      recentIssues {
        id
        number
        title
        priority
        dueDate
        updatedAt
        statusName
        statusColor
        assigneeId
        assigneeName
        assigneeAvatar
      }
      recentPages {
        id
        title
        emojiIcon
        updatedAt
        createdByName
      }
      recentVaultFiles {
        id
        name
        mimeType
        sizeBytes
        createdAt
      }
      recentWhiteboards {
        id
        title
        elementCount
        updatedAt
        isLocked
      }
    }
  }
`)

export const GET_PROJECT_CONTRIBUTOR_STATS = gql(`
  query GetProjectContributorStats($projectId: ID!) {
    projectContributorStats(projectId: $projectId) {
      userId
      name
      avatarUrl
      assigned
      completed
    }
  }
`)

// ── Mutations (imported by features/manage-project-settings) ─────────────────

export const UPDATE_PROJECT = gql(`
  mutation UpdateProject($projectId: ID!, $input: UpdateProjectInput!) {
    updateProject(projectId: $projectId, input: $input) {
      ...ProjectFields
    }
  }
`)

export const ARCHIVE_PROJECT = gql(`
  mutation ArchiveProject($projectId: ID!) {
    archiveProject(projectId: $projectId) {
      id
      isArchived
    }
  }
`)

export const UNARCHIVE_PROJECT = gql(`
  mutation UnarchiveProject($projectId: ID!) {
    unarchiveProject(projectId: $projectId) {
      id
      isArchived
    }
  }
`)

export const DELETE_PROJECT = gql(`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId)
  }
`)

export const TOGGLE_PROJECT_PLUGIN = gql(`
  mutation ToggleProjectPlugin($projectId: ID!, $workspaceId: ID!, $type: String!, $enable: Boolean!) {
    toggleProjectPlugin(projectId: $projectId, workspaceId: $workspaceId, type: $type, enable: $enable)
  }
`)

export const REQUEST_PROJECT_LOGO_UPLOAD_MUTATION = gql(`
  mutation RequestProjectLogoUpload($projectId: ID!, $mimeType: String!, $sizeBytes: Int!) {
    requestProjectLogoUpload(projectId: $projectId, mimeType: $mimeType, sizeBytes: $sizeBytes) {
      presignedUrl
      logoS3Key
      expiresAt
    }
  }
`)
