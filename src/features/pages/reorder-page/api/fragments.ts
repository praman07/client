import { gql } from '@/gql'

export const REORDER_PAGE = gql(`
  mutation ReorderPage($input: ReorderPageInput!) {
    reorderPage(input: $input) {
      page {
        id
        position
        parentId
        updatedAt
      }
    }
  }
`)
