import { gql } from '@/gql'

export const GET_PAGE_SNAPSHOT = gql(`
  query GetPageSnapshot($pageId: ID!) {
    getPageSnapshot(pageId: $pageId) {
      snapshot
      lastStreamId
      snapshotTimestamp
    }
  }
`)
