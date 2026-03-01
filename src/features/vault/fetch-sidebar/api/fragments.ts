import { gql } from '@/gql'
import '@/entities/vault-folder/api/fragments'

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
