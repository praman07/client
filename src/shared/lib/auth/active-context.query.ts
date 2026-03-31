/**
 * active-context.query.ts
 *
 * GraphQL document for the activeContext query.
 * Follows the same inline gql() pattern as use-my-workspaces.ts and use-sync-workspace-context.ts.
 */
import { gql } from '@/gql'

export const ACTIVE_CONTEXT_QUERY = gql(`
  query GetActiveContext($workspaceId: ID!, $projectId: ID) {
    activeContext(workspaceId: $workspaceId, projectId: $projectId) {
      userId
      workspaceId
      projectId
      workspaceRole
      projectRole
      grantedPermissions
      featureFlags {
        key
        enabled
      }
    }
  }
`)
