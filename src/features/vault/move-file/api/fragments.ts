import { gql } from '@/gql'
import '@/entities/vault-file'

export const MOVE_VAULT_FILE = gql(`
  mutation MoveVaultFile($input: MoveVaultFileInput!) {
    moveVaultFile(input: $input) {
      file {
        ...VaultFileFields
      }
    }
  }
`)
