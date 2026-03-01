/**
 * VaultFile entity types.
 *
 * Derived from the VaultFile GraphQL type (vault schema.graphql).
 * Covers the full file lifecycle: PENDING → ACTIVE → DELETED.
 *
 * @layer Entity
 */

/** Upload lifecycle — server-authoritative. Only ACTIVE files are visible in the UI. */
export type VaultFileStatus = 'PENDING' | 'ACTIVE' | 'DELETED'

/** Which module originally uploaded this file */
export type VaultFileSource = 'VAULT' | 'PAGE' | 'CHAT' | 'WHITEBOARD' | 'TASK'

/** Minimal user shape attached to every file listing */
export interface VaultUploader {
  id: string
  fullName: string
  avatarUrl: string | null
}

/**
 * A file in the Vault.
 * folderId = null → file lives at root (Home level).
 * Only files with status = ACTIVE are shown in the UI.
 */
export interface VaultFile {
  id: string
  projectId: string
  /** null = root-level file — no parent folder */
  folderId: string | null
  name: string
  mimeType: string
  /** BigInt serialised as Float from the GraphQL server */
  sizeBytes: number
  source: VaultFileSource
  /** pageId | conversationId | boardId | taskId — null for source=VAULT */
  sourceId: string | null
  status: VaultFileStatus
  uploader: VaultUploader | null
  confirmedAt: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Shape returned by getVaultDownloadUrl.
 * TTL = 5 minutes. NEVER cache — always request a fresh URL.
 * Stale URLs expose access after a user is removed from the project.
 */
export interface VaultDownloadUrl {
  url: string
  expiresAt: string
}

/**
 * Shape returned by getVaultUsage.
 * Polled every 60s by the StorageBar widget.
 */
export interface VaultUsage {
  projectUsedBytes: number
  projectLimitBytes: number
  workspaceUsedBytes: number
  workspaceLimitBytes: number
  projectFileCount: number
  projectFileCountLimit: number
}
