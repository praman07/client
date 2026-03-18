/**
 * TanStack Query key factory for the vault-file entity.
 *
 * Consumed by:
 *  - features/vault/fetch-node          → vaultFileKeys.detail(fileId)
 *  - features/vault/fetch-download-url  → vaultFileKeys.downloadUrl(fileId)
 *  - features/vault/fetch-vault-usage   → vaultFileKeys.usage(projectId)
 *  - features/vault/upload-file         → invalidates vaultFileKeys.usage(...)
 *  - features/vault/rename-file         → invalidates vaultFileKeys.detail(id)
 *  - features/vault/delete-file         → invalidates vaultFileKeys.usage(...)
 *
 * ⚠️  Children query (folders + files) uses vaultNodeKeys.children — see vault-node-keys.ts
 *
 * @layer Entity
 */
export const vaultFileKeys = {
  all: (projectId: string) => ['vault-file', projectId] as const,

  /**
   * Full metadata for a single file (detail / info panel).
   * staleTime: 30s. Invalidated by rename / move / delete.
   */
  detail: (fileId: string) => ['vault-file', 'detail', fileId] as const,

  /**
   * Presigned S3 GET URL for a file.
   * staleTime: 0, gcTime: 0 — NEVER persisted in the cache.
   */
  downloadUrl: (fileId: string) =>
    ['vault-file', 'download-url', fileId] as const,

  /**
   * Project + workspace storage usage.
   * staleTime: 60s, refetchInterval: 60_000.
   */
  usage: (projectId: string) =>
    [...vaultFileKeys.all(projectId), 'usage'] as const,
}
