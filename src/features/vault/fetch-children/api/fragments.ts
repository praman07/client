import { gql } from '@/gql'
import '@/entities/vault-folder'
import '@/entities/vault-file'

export const GET_VAULT_CHILDREN = gql(`
  query GetVaultChildren(
    $projectId: ID!
    $parentFolderId: ID
    $cursor: ID
    $limit: Int
    $sortBy: VaultSortField
    $sortDir: SortDirection
  ) {
    getVaultChildren(
      projectId: $projectId
      parentFolderId: $parentFolderId
      cursor: $cursor
      limit: $limit
      sortBy: $sortBy
      sortDir: $sortDir
    ) {
      folders {
        ...VaultFolderFields
      }
      files {
        ...VaultFileFields
      }
      totalFileCount
      hasNextPage
      nextCursor
    }
  }
`)
