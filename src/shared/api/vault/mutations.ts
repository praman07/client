/**
 * Vault Shared Client API — GQL Document Strings
 *
 * Raw GraphQL documents used by the vault API functions.
 * Uses the same gql() tag pattern as the rest of the codebase.
 *
 * NOTE: CONFIRM_VAULT_UPLOAD_EXTERNAL is intentionally a different export name
 * from the CONFIRM_VAULT_UPLOAD in features/vault/upload-file/api/fragments.ts
 * to prevent import collisions. Both call the same server mutation.
 *
 * @layer Shared
 */
import { gql } from '@/gql'

/** Register a file in Vault and receive a presigned S3 PUT URL. */
export const REGISTER_EXTERNAL_FILE = gql(`
  mutation RegisterExternalFile($input: RegisterExternalFileInput!) {
    registerExternalFile(input: $input) {
      fileId
      presignedUrl
      expiresAt
    }
  }
`)

/** Confirm an upload after PUT to S3 — activates the VaultFile row. */
export const CONFIRM_VAULT_UPLOAD_EXTERNAL = gql(`
  mutation ConfirmVaultUploadExternal($input: ConfirmVaultUploadInput!) {
    confirmVaultUpload(input: $input) {
      file {
        id
        name
        mimeType
        sizeBytes
        status
      }
    }
  }
`)

/** Get a fresh presigned GET URL for a single file (1-hour TTL). */
export const GET_DOWNLOAD_URL = gql(`
  query GetVaultDownloadUrl($fileId: ID!) {
    getVaultDownloadUrl(fileId: $fileId) {
      url
      expiresAt
    }
  }
`)

/**
 * Batch-fetch presigned GET URLs for multiple files in one round-trip.
 * Returns per-file status — DELETED and FORBIDDEN are valid, non-error states.
 */
export const GET_BATCH_DOWNLOAD_URLS = gql(`
  query GetBatchDownloadUrls($fileIds: [ID!]!) {
    getBatchDownloadUrls(fileIds: $fileIds) {
      fileId
      url
      status
      name
      mimeType
      sizeBytes
    }
  }
`)

/**
 * Mark one or more vault files as unreferenced after they are removed from
 * saved document content. Called by the editor on save — does NOT delete
 * files immediately. The cleanup job handles deferred deletion after a
 * 30-minute grace period, preserving in-session undo.
 */
export const MARK_FILES_UNREFERENCED = gql(`
  mutation MarkFilesUnreferenced($input: MarkFilesUnreferencedInput!) {
    markFilesUnreferenced(input: $input) {
      markedCount
    }
  }
`)

