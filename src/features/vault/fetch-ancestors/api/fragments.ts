import { gql } from '@/gql'
import '@/entities/vault-folder'

export const GET_VAULT_ANCESTORS = gql(`
  query GetVaultAncestors($folderId: ID!) {
    getVaultAncestors(folderId: $folderId) {
      ...VaultFolderFields
    }
  }
`)
