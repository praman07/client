import { gql } from '@/gql'

export const GET_VAULT_DOWNLOAD_URL = gql(`
  query GetVaultDownloadUrl($fileId: ID!) {
    getVaultDownloadUrl(fileId: $fileId) {
      url
      expiresAt
    }
  }
`)
