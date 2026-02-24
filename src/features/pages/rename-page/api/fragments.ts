import { gql } from '@/gql'

export const RENAME_PAGE = gql(`
  mutation RenamePage($input: RenamePageInput!) {
    renamePage(input: $input) {
      page {
        id
        title
        projectId
        parentId
        icon
        position
        isArchived
        isLocked
        updatedAt
      }
    }
  }
`)
