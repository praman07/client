import { gql } from '@/gql'

export const CREATE_PAGE = gql(`
  mutation CreatePage($input: CreatePageInput!) {
    createPage(input: $input) {
      page {
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
  }
`)
