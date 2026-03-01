import { gql } from '@/gql'

/**
 * Core file fields — used by every query/mutation that returns a VaultFile.
 * Includes the uploader sub-object (always needed for file listings).
 *
 * Fields match the server schema exactly (type-defs.ts).
 * status is a String on the schema (not a typed enum).
 */
export const VAULT_FILE_FIELDS = gql(`
  fragment VaultFileFields on VaultFile {
    id
    projectId
    workspaceId
    folderId
    uploaderUserId
    name
    mimeType
    sizeBytes
    s3Key
    source
    sourceId
    status
    uploader {
      id
      fullName
      avatarUrl
    }
    confirmedAt
    createdAt
    updatedAt
  }
`)
