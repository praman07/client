/**
 * Vault Shared Client API — Types
 *
 * Shared type definitions for all Vault API calls across modules:
 * Chat, Pages, Whiteboard, Issues.
 *
 * @layer Shared — no React, no hooks, framework-agnostic
 */

export type VaultFileSource = 'CHAT' | 'PAGE' | 'WHITEBOARD' | 'TASK' | 'VAULT'

export interface RegisterExternalFileInput {
  workspaceId: string
  projectId: string
  source: VaultFileSource
  sourceId: string
  name: string
  mimeType: string
  /** File size in bytes. JS number is safe up to 2^53 — sufficient for 50 MB limit. */
  sizeBytes: number
}

/** Returned by registerExternalFile — inferred from GQL, kept here for docs only */
// VaultUploadSlot: return type inferred directly from GQL client to avoid struct mismatch.
// Access via: Awaited<ReturnType<typeof registerExternalFile>>
/**
 * Per-file result from batchGetDownloadUrls.
 * Matches the generated GQL shape from GetBatchDownloadUrlsQuery.
 * Callers MUST handle status === 'DELETED' and 'FORBIDDEN' gracefully
 * (render tombstones, not crashes).
 *
 * status is `string` (not a union) — the server sends it as a plain string.
 * Narrow it locally if needed: status === 'ACTIVE' | 'DELETED' etc.
 */
export interface FileUrlResult {
  fileId: string
  /** null or undefined when status is DELETED or FORBIDDEN */
  url?: string | null
  /** 'ACTIVE' | 'DELETED' | 'PENDING' | 'FORBIDDEN' — typed as string to match generated GQL */
  status: string
  name?: string | null
  mimeType?: string | null
  sizeBytes?: number | null
}

/**
 * Result of a full 3-step upload via uploadToVault().
 * All fields are safe to embed in message metadata / YJS nodes.
 * The url is a short-lived presigned GET URL — do NOT persist it.
 * Only fileId, name, mimeType, sizeBytes should be stored durably.
 */
export interface UploadToVaultResult {
  fileId: string
  /** Short-lived presigned GET URL — 1-hour TTL. Use for immediate display only. */
  url: string
  name: string
  mimeType: string
  sizeBytes: number
}

/**
 * MIME type allowlist for client-side upload preflight.
 * Mirrors VAULT_ALLOWED_MIME_PREFIXES + VAULT_BLOCKED_EXTENSIONS from
 * server/src/modules/vault/lib/constants.ts.
 *
 * Canonical source: features/vault/upload-file/lib/mime-allowlist.ts
 * Re-exported here so shared/ utilities (e.g. shared/lib/blocknote) can
 * import it without crossing the features/ boundary.
 *
 * Update this list whenever the server allowlist changes (keep both in sync).
 */
export const VAULT_ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'image/svg+xml', 'image/bmp', 'image/tiff', 'image/heic', 'image/avif',
  // Video
  'video/mp4', 'video/webm', 'video/quicktime',
  'video/x-msvideo', 'video/x-matroska',
  // Audio
  'audio/mpeg', 'audio/wav', 'audio/ogg',
  'audio/webm', 'audio/flac', 'audio/aac',
  // Documents
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint',
  // Archives
  'application/zip', 'application/x-tar', 'application/gzip',
  'application/x-7z-compressed', 'application/x-rar-compressed',
  // Text & Code
  'text/plain', 'text/csv', 'text/markdown', 'text/html',
  'text/css', 'text/javascript', 'application/json', 'application/xml',
  // Design
  'image/vnd.adobe.photoshop', 'application/postscript', 'image/x-xcf',
])
