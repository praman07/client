/**
 * TanStack Query key factory for vault mixed-node queries.
 *
 * "vault node" = either a folder or a file — used when the query
 * returns both types together (e.g. getVaultChildren).
 *
 * Registered by:  features/vault/fetch-children (useVaultChildren)
 * Invalidated by: create/rename/delete/move-folder,
 *                 upload/rename/move/delete-file
 *
 * @layer Entity
 */
export const vaultNodeKeys = {
  /**
   * Mixed listing: non-paginated folders + cursor-paginated files
   * for a given folder. parentFolderId = null → Home / root level.
   * staleTime: 30s.
   */
  children: (projectId: string, parentFolderId: string | null) =>
    ['vault-node', projectId, 'children', parentFolderId] as const,
}
