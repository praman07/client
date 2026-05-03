/**
 * GET_VAULT_USAGE — query document for useVaultQuota hook.
 *
 * NOTE: This requires the client schema.graphql to be synced.
 * Run: bun gen (server) → pnpm gen (client)
 * The VaultUsage type will then be available in @/gql/graphql.
 *
 * projectAvailableBytes is computed client-side:
 *   projectLimitBytes - projectUsedBytes - projectReservedBytes
 */
export const GET_VAULT_USAGE = /* GraphQL */ `
  query GetVaultUsageShared($projectId: ID!) {
    getVaultUsage(projectId: $projectId) {
      projectUsedBytes
      projectReservedBytes
      projectLimitBytes
      projectFileCount
      projectFileCountLimit
      workspaceUsedBytes
      workspaceReservedBytes
      workspaceLimitBytes
      percentUsed
    }
  }
`

