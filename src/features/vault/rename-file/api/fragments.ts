import { gql } from '@/gql'
import '@/entities/vault-file'

export const RENAME_VAULT_FILE = gql(`
  mutation RenameVaultFile($input: RenameVaultFileInput!) {
    renameVaultFile(input: $input) {
      file {
        ...VaultFileFields
      }
    }
  }
`)
