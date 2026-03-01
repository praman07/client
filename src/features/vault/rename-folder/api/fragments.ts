import { gql } from '@/gql'
import '@/entities/vault-folder/api/fragments'

export const RENAME_VAULT_FOLDER = gql(`
  mutation RenameVaultFolder($input: RenameVaultFolderInput!) {
    renameVaultFolder(input: $input) {
      folder {
        ...VaultFolderFields
      }
    }
  }
`)
