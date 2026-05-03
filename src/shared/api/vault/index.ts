/**
 * Vault Shared Client API — Public Surface
 *
 * System Design Decision: Framework-Agnostic Core
 *   All Vault operations are plain async functions requiring an explicit `token`.
 *   This decouples the storage layer from React context (`useAuth`), enabling
 *   use in background workers, raw event listeners, and unit tests.
 *
 * System Design Decision: 3-Phase Upload Pipeline
 *   1. Register: Server validates MIME/Quota → Provisions S3 PUT slot.
 *   2. Push: Client streams bytes directly to S3 (Server bypass).
 *   3. Confirm: Server asserts S3 HeadObject → Activates DB record.
 *
 * @layer Shared
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
import { env } from '@/shared/config/env'

export { VAULT_ALLOWED_MIME_TYPES }

// ─── Step 1: Register ────────────────────────────────────────────────────────

/**
 * System Design Decision: Pre-Flight Validation
 * Reserves quota atomically and asserts file constraints before any bytes
 * hit the network. Returns a short-lived presigned PUT URL.
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
 * System Design Decision: Asynchronous Activation
 * Verifies S3 `HeadObject` and transitions the record to ACTIVE.
 * Designed to be idempotent to survive network drops between the PUT and the confirm.
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

// ─── URL Builder ─────────────────────────────────────────────────────────────

/**
 * System Design Decision: Deterministic Proxy Routing
 * Returns a permanent, stateless URL (`{SERVER_URL}/vault/file/{fileId}`) 
 * without requiring network resolution. The server proxy enforces RBAC and streams 
 * the S3 bytes globally, allowing deep integration into eternal stores like Y.Docs.
 */
export function getVaultFileUrl(fileId: string): string {
  const base = env.VITE_SERVER_URL ?? ''
  return `${base}/vault/file/${fileId}`
}

/**
 * System Design Decision: Ephemeral Read Access
 * Returns a short-lived presigned URL. Primarily used by the Chat pipeline
 * to load temporary assets immediately without the proxy overhead.
 * // TODO (Architecture): Consider migrating the Chat media pipeline to the permanent proxy (`getVaultFileUrl`) to unify the media architecture.
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
 * System Design Decision: Batched Resolution
 * Optimizes network overhead by resolving multiple ephemeral URLs at once.
 * Callers are structurally forced to handle the finite state machine of asset availability (e.g. DELETED, FORBIDDEN).
 * // TODO (Architecture): Deprecate and remove once old BlockNote `vault://` strings are fully migrated.
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
 * System Design Decision: Deferred Garbage Collection
 * Client issues a fire-and-forget mutation when an asset reference is dropped.
 * The server does NOT immediately delete the S3 object; it marks `unrefAt` and waits
 * for a 30-minute background job grace period to prevent data loss on erratic network drops or client undone actions.
 *
 * @param fileIds    - Array of unreferenced vault file IDs
 * @param entityId   - Co-located entity (e.g., pageId, issueId)
 * @param entityType - Source catalog (Page, Task, Whiteboard)
 * @param token      - Auth context
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
 * System Design Decision: Upload Orchestrator
 * Encapsulates the 3-Phase Upload Pipeline (Register → S3 Stream → Confirm) into a single asynchronous operation.
 * Automatically injects the permanent proxy URL (`getVaultFileUrl`) into the returned structure for immediate display via immutable CRDTs.
 *
 * @param file       - Raw browser file Blob
 * @param options    - Pre-flight constraints (project, source)
 * @param token      - Auth context
 * @param onProgress - XHR progress emitter
 */
export async function uploadToVault(
  file: File,
  options: RegisterExternalFileInput,
  token: string,
  onProgress?: (percent: number) => void,
): Promise<UploadToVaultResult> {
  // Step 1: Register in Vault (validate + reserve quota + get presigned PUT URL)
  const { fileId, presignedUrl } = await registerExternalFile(options, token)

  // Step 2: PUT bytes directly to S3 (reuses existing XHR helper with fetch fallback)
  await uploadToS3(presignedUrl, file, onProgress ?? (() => {}))

  // Step 3: Confirm upload (HeadObject + activate)
  await confirmVaultUpload(fileId, token)

  // Step 4: Build permanent URL — no network call needed
  const url = getVaultFileUrl(fileId)

  return {
    fileId,
    url,
    name: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  }
}
