/**
 * TanStack Query key factory for the vault-folder entity.
 *
 * Consumed by:
 *  - features/vault/fetch-sidebar      → vaultFolderKeys.sidebar(projectId)
 *  - features/vault/fetch-node         → vaultFolderKeys.detail(folderId)
 *  - features/vault/fetch-ancestors    → vaultFolderKeys.ancestors(folderId)
 *  - features/vault/rename-folder      → invalidates vaultFolderKeys.detail(id)
 *  - features/vault/move-folder        → invalidates vaultFolderKeys.sidebar(...)
 *  - features/vault/delete-folder      → invalidates vaultFolderKeys.sidebar(...)
 *  - features/vault/pin-folder         → invalidates vaultFolderKeys.sidebar(projectId)
 *  - features/vault/unpin-folder       → invalidates vaultFolderKeys.sidebar(projectId)
 *
 * ⚠️  Children query (folders + files) uses vaultNodeKeys.children — see vault-file/api/vault-node-keys.ts
 *
 * @layer Entity
 */
export const vaultFolderKeys = {
  all: (projectId: string) => ['vault-folder', projectId] as const,

  /**
   * Sidebar — pinned folders + system folders.
   * staleTime: Infinity.
   * Invalidated only by pin / unpin / delete-folder mutations.
   */
  sidebar: (projectId: string) =>
    [...vaultFolderKeys.all(projectId), 'sidebar'] as const,

  /**
   * Full metadata for a single folder (detail / info panel).
   * staleTime: 30s. Invalidated by rename / move / delete.
   */
  detail: (folderId: string) => ['vault-folder', 'detail', folderId] as const,

  /**
   * Ancestor chain for a folder (root → current), used by the breadcrumb.
   * Server fallback only — used when folderId is in URL but client trail is empty.
   * staleTime: 30s.
   */
  ancestors: (folderId: string) =>
    ['vault-folder', 'ancestors', folderId] as const,
}
