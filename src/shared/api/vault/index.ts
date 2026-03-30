/**
 * Vault Shared Client API — Public Surface
 *
 * Plain async functions (no React hooks, no context) for all Vault operations.
 * Used by Chat, Pages, Whiteboard, and Issues modules.
 *
 * All functions take an explicit `token` parameter — callers inside React
 * components obtain the token via `useAuth().getToken()` and pass it down.
 * This keeps the shared layer framework-agnostic and unit-testable.
 *
 * Upload flow (full 3-step):
 *   1. registerExternalFile  → server validates MIME, size, quota → returns presigned PUT slot
 *   2. PUT bytes directly to S3 (browser → S3; server is NOT in the upload path)
 *   3. confirmVaultUpload    → server HeadObject → activates VaultFile → increments usedBytes
 *
 * For convenience, uploadToVault() runs all 3 steps and returns a result
 * ready for embedding in message metadata or YJS document nodes.
 *
 * @layer Shared — no React, no hooks
 */
import {
  CONFIRM_VAULT_UPLOAD_EXTERNAL,
  GET_BATCH_DOWNLOAD_URLS,
  GET_DOWNLOAD_URL,
  MARK_FILES_UNREFERENCED,
  REGISTER_EXTERNAL_FILE,
} from './mutations'
import { VAULT_ALLOWED_MIME_TYPES } from './types'
import type { FileUrlResult, UploadToVaultResult } from './types'
import type { RegisterExternalFileInput } from '@/gql/graphql'
import { VaultFileSource } from '@/gql/graphql'
import { uploadToS3 } from '@/features/vault/upload-file'
import { GqlClient } from '@/shared/api/graphql-client'

export { VAULT_ALLOWED_MIME_TYPES }

// ─── Step 1: Register ────────────────────────────────────────────────────────

/**
 * Register a file in Vault and get a presigned S3 PUT URL.
 *
 * Server-side: validates MIME type, enforces max file size, checks
 * project/workspace quota atomically, creates a PENDING VaultFile row.
 *
 * Throws on: MIME rejected, file too large, quota exceeded, auth failure.
 */
export async function registerExternalFile(
  input: RegisterExternalFileInput,
  token: string,
) {
  const result = await GqlClient(token).request(REGISTER_EXTERNAL_FILE, {
    input,
  })
  return result.registerExternalFile
}

// ─── Step 3: Confirm ─────────────────────────────────────────────────────────

/**
 * Confirm an upload after the S3 PUT has completed.
 *
 * Server-side: HeadObject verifies the file landed; transitions
 * VaultFile status PENDING → ACTIVE; increments usedBytes.
 *
 * Idempotent: safe to retry if the network drops between PUT and confirm.
 */
export async function confirmVaultUpload(
  fileId: string,
  token: string,
): Promise<void> {
  await GqlClient(token).request(CONFIRM_VAULT_UPLOAD_EXTERNAL, {
    input: { fileId },
  })
}

// ─── URL Fetching ─────────────────────────────────────────────────────────────

/**
 * Get a fresh presigned GET URL for a single file.
 *
 * TTL: 1 hour. Callers should cache by fileId with a 55-minute stale time
 * (React Query staleTime: 55 * 60 * 1000).
 */
export async function getDownloadUrl(
  fileId: string,
  token: string,
): Promise<string> {
  const result = await GqlClient(token).request(GET_DOWNLOAD_URL, { fileId })
  const urlResult = result.getVaultDownloadUrl
  if (!urlResult.url) {
    throw new Error(`Download URL unavailable for file ${fileId}`)
  }
  return urlResult.url
}

/**
 * Batch-fetch presigned GET URLs for multiple files in a single round-trip.
 *
 * Returns per-file status — callers MUST handle DELETED and FORBIDDEN:
 *   - DELETED  → render tombstone: "Attachment deleted"
 *   - FORBIDDEN→ render tombstone: "No access"
 *   - PENDING  → file not yet confirmed (show loading or skip)
 *   - ACTIVE   → render url
 *
 * Short-circuits and returns [] without a network call when fileIds is empty.
 */
export async function batchGetDownloadUrls(
  fileIds: Array<string>,
  token: string,
): Promise<Array<FileUrlResult>> {
  if (fileIds.length === 0) return []
  const result = await GqlClient(token).request(GET_BATCH_DOWNLOAD_URLS, {
    fileIds,
  })
  return result.getBatchDownloadUrls as Array<FileUrlResult>
}

// ─── Unreferenced tracking ────────────────────────────────────────────────────

/**
 * Re-exported so callers don't need to import from @/gql/graphql directly.
 * Only PAGE and TASK are valid for editor-side unreferenced tracking.
 */
export { VaultFileSource }

/**
 * Mark vault files as unreferenced after they are removed from saved content.
 *
 * Called by the editor on save — fire-and-forget. Failures are caught and
 * logged but never propagate to the caller so the save flow is never blocked.
 *
 * The server sets unrefAt on each file. The cleanup job picks them up after
 * a 30-minute grace period and verifies they are still absent before deleting.
 *
 * @param fileIds    - vault fileIds that are no longer in the saved document
 * @param entityId   - the pageId or issueId that was just saved
 * @param entityType - VaultFileSource.Page or VaultFileSource.Task
 * @param token      - Clerk session JWT
 */
export async function markFilesUnreferenced(
  fileIds: Array<string>,
  entityId: string,
  entityType: VaultFileSource,
  token: string,
): Promise<void> {
  if (fileIds.length === 0) return
  await GqlClient(token).request(MARK_FILES_UNREFERENCED, {
    input: { fileIds, entityId, entityType },
  })
}

// ─── Full Upload Orchestrator ─────────────────────────────────────────────────

/**
 * Full 3-step upload orchestrator.
 *
 * Steps:
 *   1. registerExternalFile  — reserve quota, get presigned PUT URL
 *   2. PUT bytes to S3 via XHR (with progress) + fetch fallback
 *   3. confirmVaultUpload    — activate file
 *   4. getDownloadUrl        — fetch short-lived URL for immediate display
 *
 * Returns UploadToVaultResult — safe to embed in message metadata or YJS nodes.
 *
 * IMPORTANT: The returned `url` is a short-lived presigned GET URL (1-hour).
 * - For Chat:       embed url in ChatAttachment.url for immediate display; cache
 *                   by fileId via useDownloadUrl() hook (4-min stale time)
 * - For Pages/WB:   store only fileId in the YJS document; refresh urls on load
 *                   via batchGetDownloadUrls()
 * DO NOT persist `url` to IndexedDB or YJS documents.
 *
 * @param file     - The File object from the browser (input, paste, or drop)
 * @param options  - RegisterExternalFileInput (source, sourceId, projectId, etc.)
 * @param token    - Clerk session JWT for auth
 * @param onProgress - Optional 0–100 progress callback for upload UI
 */
export async function uploadToVault(
  file: File,
  options: RegisterExternalFileInput,
  token: string,
  onProgress?: (percent: number) => void,
): Promise<UploadToVaultResult> {
  // Step 1: Register in Vault (validate + reserve quota + get presigned URL)
  const { fileId, presignedUrl } = await registerExternalFile(options, token)

  // Step 2: PUT bytes directly to S3 (reuses existing XHR helper with fetch fallback)
  await uploadToS3(presignedUrl, file, onProgress ?? (() => {}))

  // Step 3: Confirm upload (HeadObject + activate)
  await confirmVaultUpload(fileId, token)

  // Step 4: Get download URL for immediate display
  const url = await getDownloadUrl(fileId, token)

  return {
    fileId,
    url,
    name: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  }
}
