import { gql } from '@/gql'
import '@/entities/vault-folder'

export const GET_VAULT_SIDEBAR = gql(`
  query GetVaultSidebar($projectId: ID!) {
    getVaultSidebar(projectId: $projectId) {
      pinnedFolders {
        ...VaultFolderFields
      }
      systemFolders {
        ...VaultFolderFields
      }
    }
  }
`)
