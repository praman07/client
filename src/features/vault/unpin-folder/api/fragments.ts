import { gql } from '@/gql'

export const UNPIN_VAULT_FOLDER = gql(`
  mutation UnpinVaultFolder($input: UnpinVaultFolderInput!) {
    unpinVaultFolder(input: $input) {
      success
      id
    }
  }
`)
