import { gql } from '@/gql'

/**
 * Fetches page metadata by ID.
 * No Y.Doc content — use fetch-snapshot for document content.
 */
export const GET_PAGE = gql(`
  query GetPage($pageId: ID!) {
    getPage(pageId: $pageId) {
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
  }
`)
