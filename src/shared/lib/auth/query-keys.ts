/**
 * query-keys.ts
 *
 * TanStack Query key factory for the activeContext query.
 * Follows the same factory pattern as workspaceKeys in entities/workspace/api/query-keys.ts.
 */

export const authContextKeys = {
  all: ['auth-context'] as const,
  scope: (workspaceId: string, projectId?: string) =>
    [...authContextKeys.all, workspaceId, projectId ?? 'none'] as const,
}
