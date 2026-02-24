import { gql } from '@/gql'

/**
 * Core page fields — used in all page queries
 */
export const PAGE_FIELDS = gql(`
  fragment PageFields on Page {
    id
    title
    workspaceId
    projectId
    parentId
    icon
    coverUrl
    position
    isArchived
    isLocked
    s3Key
    createdBy
    createdAt
    updatedAt
  }
`)

/**
 * Page with full collaborator list — used by:
 * - features/pages/fetch-collaborators
 * - features/pages/add-collaborators
 */
export const PAGE_WITH_COLLABORATORS = gql(`
  fragment PageWithCollaborators on Page {
    ...PageFields
    collaborators {
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
  }
`)

/**
 * Page with nested children for the project pages tree — used by:
 * - features/pages/fetch-project-pages (getProjectPages query)
 *
 * Supports 3 levels of nesting inline (root → child → grandchild).
 * Deeper nesting leverages server-side `children` and is flattened by
 * the page-list widget's tree-builder utility.
 */
export const PAGE_WITH_CHILDREN = gql(`
  fragment PageWithChildren on Page {
    ...PageFields
    children {
      ...PageFields
      children {
        ...PageFields
        children {
          ...PageFields
        }
      }
    }
  }
`)
