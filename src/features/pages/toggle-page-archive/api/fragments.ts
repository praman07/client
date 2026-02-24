import { gql } from '@/gql'

export const ARCHIVE_PAGE = gql(`
  mutation ArchivePage($input: ArchivePageInput!) {
    archivePage(input: $input) {
      page {
        id
        isArchived
        updatedAt
      }
    }
  }
`)

export const UNARCHIVE_PAGE = gql(`
  mutation UnarchivePage($input: UnarchivePageInput!) {
    unarchivePage(input: $input) {
      page {
        id
        isArchived
        updatedAt
      }
    }
  }
`)
