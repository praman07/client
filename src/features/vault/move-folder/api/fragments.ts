import { gql } from '@/gql'
import '@/entities/vault-folder/api/fragments'

export const MOVE_VAULT_FOLDER = gql(`
  mutation MoveVaultFolder($input: MoveVaultFolderInput!) {
    moveVaultFolder(input: $input) {
      folder {
        ...VaultFolderFields
      }
    }
  }
`)
