import { gql } from '@/gql'

/**
 * Fetches live presence from Redis ZSET — who is currently viewing/editing.
 * NOT the DB collaborator list (use getPageCollaborators for that).
 * joinedAt omitted — Redis ZSET presence has no join timestamp.
 */
export const GET_ACTIVE_PAGE_COLLABORATORS = gql(`
  query GetActivePageCollaborators($pageId: ID!) {
    getActivePageCollaborators(pageId: $pageId) {
      userId
      role
      user {
        id
        fullName
        avatarUrl
      }
    }
  }
`)
