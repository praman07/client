import { gql } from '@/gql'

/**
 * Fetches the authoritative DB collaborator list for a page.
 * Ordered by joinedAt ASC. For live presence, use fetch-active-page-collaborators.
 */
export const GET_PAGE_COLLABORATORS = gql(`
  query GetPageCollaborators($pageId: ID!) {
    getPageCollaborators(pageId: $pageId) {
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
