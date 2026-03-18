import { gql } from '@/gql'
import '@/entities/vault-folder'

export const CREATE_VAULT_FOLDER = gql(`
  mutation CreateVaultFolder($input: CreateVaultFolderInput!) {
    createVaultFolder(input: $input) {
      folder {
        ...VaultFolderFields
      }
    }
  }
`)
