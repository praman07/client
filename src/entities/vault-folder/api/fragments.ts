import { gql } from '@/gql'

/**
 * Core folder fields — used by every query/mutation that returns a VaultFolder.
 * Features import this and compose it into their own operation documents.
 *
 * Fields match the server schema exactly (type-defs.ts).
 * isPinned, childFolderCount, fileCount are NOT in the server VaultFolder type.
 */
export const VAULT_FOLDER_FIELDS = gql(`
  fragment VaultFolderFields on VaultFolder {
    id
    projectId
    parentFolderId
    name
    isSystem
    createdAt
    updatedAt
  }
`)
