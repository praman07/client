import { gql } from '@/gql'
export { UPDATE_WORKSPACE_MUTATION } from '@/entities/workspace'

export const GET_WORKSPACE_SETTINGS_QUERY = gql(`
  query GetWorkspaceSettings($workspaceId: ID!) {
    workspaceById(workspaceId: $workspaceId) {
      ...WorkspaceSettingsFragment
    }
  }
`)
