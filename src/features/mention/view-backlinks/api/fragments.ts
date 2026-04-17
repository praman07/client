import { gql } from '@/gql'

export const GET_BACKLINKS = gql(`
  query GetBacklinks($targetEntityId: ID!, $limit: Int, $cursor: ID, $filters: BacklinkFilters) {
    getBacklinks(targetEntityId: $targetEntityId, limit: $limit, cursor: $cursor, filters: $filters) {
      backlinks {
        id
        sourceEntityId
        sourceEntityType
        targetEntityId
        targetEntityType
        context
        createdAt
        sourceMention {
          id
          displayText
          sourceLocation
          createdAt
        }
      }
      total
      hasMore
    }
  }
`)
