import { gql } from '@/gql'
import '@/entities/vault-folder'
import '@/entities/vault-file'

export const GET_VAULT_NODE = gql(`
  query GetVaultNode($id: ID!, $type: VaultNodeType!) {
    getVaultNode(id: $id, type: $type) {
      ... on VaultFolder {
        ...VaultFolderFields
      }
      ... on VaultFile {
        ...VaultFileFields
      }
    }
  }
`)
