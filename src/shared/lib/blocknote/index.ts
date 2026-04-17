/**
 * @layer Shared → lib/blocknote
 *
 * Public surface for BlockNote + Vault integration utilities.
 * Used by: widgets/page-editor, features/issues/edit-issue.
 *
 * Note: the `mention` schema lives in `features/mention` (not here)
 * because it imports MentionChip from that feature layer.
 * Import it as: import { mentionSchema } from '@/features/mention'
 */
export { createBlockNoteUploadAdapter } from './blocknote-upload-adapter'
export type {
  BlockNoteUploadAdapterOptions,
  BlockNoteUploadError,
} from './blocknote-upload-adapter'
export { extractActiveFileIds, migrateDocumentUrls } from './blocknote-file-utils'
