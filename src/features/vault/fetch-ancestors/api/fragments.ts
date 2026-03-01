import { gql } from '@/gql'
import '@/entities/vault-folder/api/fragments'

export const GET_VAULT_ANCESTORS = gql(`
  query GetVaultAncestors($folderId: ID!) {
    getVaultAncestors(folderId: $folderId) {
      ...VaultFolderFields
    }
  }
`)
