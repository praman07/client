import { gql } from '@/gql'

export const UPDATE_PAGE_DETAILS = gql(`
  mutation UpdatePageDetails($input: UpdatePageDetailsInput!) {
    updatePageDetails(input: $input) {
      page {
        id
        icon
        coverUrl
        projectId
        parentId
        title
        position
        isArchived
        isLocked
        updatedAt
      }
    }
  }
`)
