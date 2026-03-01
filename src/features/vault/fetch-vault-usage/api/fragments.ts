import { gql } from '@/gql'

export const GET_VAULT_USAGE = gql(`
  query GetVaultUsage($projectId: ID!) {
    getVaultUsage(projectId: $projectId) {
      projectUsedBytes
      projectLimitBytes
      workspaceUsedBytes
      workspaceLimitBytes
      projectFileCount
      projectFileCountLimit
    }
  }
`)
