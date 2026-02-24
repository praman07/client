import { gql } from '@/gql'

export const DELETE_PAGE = gql(`
  mutation DeletePage($input: DeletePageInput!) {
    deletePage(input: $input) {
      success
      pageId
    }
  }
`)
