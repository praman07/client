import { gql } from '@/gql'

export const DELETE_VAULT_FOLDER = gql(`
  mutation DeleteVaultFolder($input: DeleteVaultFolderInput!) {
    deleteVaultFolder(input: $input) {
      success
      id
    }
  }
`)
