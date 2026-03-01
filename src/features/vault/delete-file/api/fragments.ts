import { gql } from '@/gql'

export const DELETE_VAULT_FILE = gql(`
  mutation DeleteVaultFile($input: DeleteVaultFileInput!) {
    deleteVaultFile(input: $input) {
      success
      id
    }
  }
`)
