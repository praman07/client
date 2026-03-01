import { gql } from '@/gql'
import '@/entities/vault-folder/api/fragments'

export const PIN_VAULT_FOLDER = gql(`
  mutation PinVaultFolder($input: PinVaultFolderInput!) {
    pinVaultFolder(input: $input) {
      folder {
        ...VaultFolderFields
      }
    }
  }
`)
