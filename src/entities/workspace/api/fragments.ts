import { gql } from '@/gql'

// ── Fragments ─────────────────────────────────────────────────────────────────

/**
 * Lightweight fragment for list views, workspace card, and sidebar switcher.
 * Do NOT add heavy fields here — this is fetched on every app mount.
 */
export const WORKSPACE_FRAGMENT = gql(`
  fragment WorkspaceFragment on Workspace {
    id
    name
    slug
    logoUrl
    memberRole
  }
`)

/**
 * Minimal fragment for workspace context resolution (slug → id mapping).
 * Used exclusively by useSyncWorkspaceContext.
 * Does NOT include memberRole — context sync only needs routing identity.
 */
export const WORKSPACE_LIGHT_FRAGMENT = gql(`
  fragment WorkspaceLightFragment on Workspace {
    id
    name
    slug
    logoUrl
  }
`)

/**
 * Full workspace data fragment for the settings page.
 * Includes admin-only fields: domainWhitelist, timestamps.
 */
export const WORKSPACE_SETTINGS_FRAGMENT = gql(`
  fragment WorkspaceSettingsFragment on Workspace {
    id
    name
    slug
    logoUrl
    domainWhitelist
    memberRole
    createdAt
    updatedAt
  }
`)

// ── Workspace Queries ─────────────────────────────────────────────────────────

export const GET_MY_WORKSPACES_QUERY = gql(`
  query GetMyWorkspaces {
    myWorkspaces {
      ...WorkspaceFragment
    }
  }
`)

export const GET_WORKSPACE_BY_SLUG_QUERY = gql(`
  query GetWorkspaceBySlug($slug: String!) {
    workspaceBySlug(slug: $slug) {
      ...WorkspaceLightFragment
    }
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

// ── Role Queries ──────────────────────────────────────────────────────────────

export const GET_WORKSPACE_ROLES_QUERY = gql(`
  query GetWorkspaceRoles($workspaceId: ID!) {
    workspaceRoles(workspaceId: $workspaceId) {
      id
      name
      description
      isSystem
      rank
    }
  }
`)

// ── Workspace Mutations ───────────────────────────────────────────────────────

/**
 * Update workspace name, logoUrl, or domainWhitelist.
 * Returns full settings fragment so TanStack Query cache auto-updates.
 */
export const UPDATE_WORKSPACE_MUTATION = gql(`
  mutation UpdateWorkspace($workspaceId: ID!, $input: UpdateWorkspaceInput!) {
    updateWorkspace(workspaceId: $workspaceId, input: $input) {
      ...WorkspaceSettingsFragment
    }
  }
`)

/**
 * Step 1 of slug rename flow.
 * Prerequisite: checkSlugAvailability must have been called first (creates Redis reservation).
 * Returns updated workspace with new slug via settings fragment.
 */
export const RENAME_WORKSPACE_SLUG_MUTATION = gql(`
  mutation RenameWorkspaceSlug($workspaceId: ID!, $slug: String!) {
    renameWorkspaceSlug(workspaceId: $workspaceId, slug: $slug) {
      ...WorkspaceSettingsFragment
    }
  }
`)

/**
 * Step 1 of workspace logo upload flow.
 * Returns a presigned PUT URL + final logoUrl to store after S3 upload succeeds.
 * After upload: call updateWorkspace({ logoUrl }) with the returned logoUrl.
 */
export const REQUEST_WORKSPACE_LOGO_UPLOAD_MUTATION = gql(`
  mutation RequestWorkspaceLogoUpload($workspaceId: ID!, $mimeType: String!, $sizeBytes: Int!) {
    requestWorkspaceLogoUpload(workspaceId: $workspaceId, mimeType: $mimeType, sizeBytes: $sizeBytes) {
      presignedUrl
      logoUrl
      expiresAt
    }
  }
`)

/**
 * Checks if a slug is available for a new workspace or a rename.
 * Creates a temporary Redis reservation if available.
 */
export const CHECK_SLUG_AVAILABILITY_MUTATION = gql(`
  mutation CheckSlugAvailability($slug: String!) {
    checkSlugAvailability(slug: $slug) {
      available
      message
      reservationId
    }
  }
`)

// ── Workspace Members ─────────────────────────────────────────────────────────

/**
 * Query to fetch all members of a workspace with their role information.
 * Lives in the Entity layer so any feature can consume it without
 * coupling to features/view-members.
 *
 * @layer Entity — workspace
 */
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
