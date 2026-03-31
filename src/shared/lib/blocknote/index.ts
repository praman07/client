/**
 * @layer Shared → lib/blocknote
 *
 * Public surface for BlockNote + Vault integration utilities.
 * Used by: widgets/page-editor, features/issues/edit-issue.
 */
export { createBlockNoteUploadAdapter } from './blocknote-upload-adapter'
export type {
  BlockNoteUploadAdapterOptions,
  BlockNoteUploadError,
} from './blocknote-upload-adapter'
export { extractActiveFileIds, migrateDocumentUrls } from './blocknote-file-utils'
