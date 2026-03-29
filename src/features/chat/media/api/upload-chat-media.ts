/**
 * upload-chat-media.ts
 * Orchestrates the 3-step Vault upload flow specifically for chat attachments.
 *
 * This is the ONLY entry point callers should use for chat media —
 * it enforces context limits, MIME allowlist, and available quota
 * before touching the network.
 *
 * Upload timing: EAGER (Option A)
 *   Upload starts immediately when the user picks/pastes a file, not on Send.
 *   This mirrors Discord/Slack behaviour — by the time the user types their
 *   message, the file is often already confirmed in Vault.
 *
 * @layer Features → chat/media/api
 */

import type { ChatAttachment } from '@/shared/contracts/chat/message'
import { uploadToVault } from '@/shared/api/vault'
import { VAULT_ALLOWED_MIME_TYPES } from '@/features/vault/upload-file'
import { VaultFileSource } from '@/gql/graphql'
import {
  CHAT_MAX_ATTACHMENTS,
  getUploadErrorMessage,
  validateEmbeddedUpload,
} from '@/shared/lib/upload-limits'

// ── Input types ───────────────────────────────────────────────────────────────

export interface UploadChatMediaOptions {
  /** Project the conversation belongs to */
  projectId: string
  /** Workspace the project belongs to */
  workspaceId: string
  /** The conversation (channel or DM) the file is attached to */
  conversationId: string
  /** Clerk access token — passed from the calling component via useAuth().getToken() */
  token: string
  /**
   * User's available storage quota in bytes.
   * Pass Infinity if quota is not yet loaded (skips quota check).
   */
  availableBytes?: number
  /**
   * How many attachments are already staged for this message.
   * Used to enforce the CHAT_MAX_ATTACHMENTS cap (default 5).
   */
  currentAttachmentCount?: number
  /** Optional upload progress callback. Receives 0–100. */
  onProgress?: (percent: number) => void
}

// ── Upload error (thrown, not returned) ───────────────────────────────────────

export class ChatMediaUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ChatMediaUploadError'
  }
}

// ── Core function ─────────────────────────────────────────────────────────────

/**
 * Uploads a file for use in a chat message via the Vault pipeline:
 *   1. Client-side validation (MIME, context size limit, available quota, attachment count)
 *   2. registerExternalFile → get presigned PUT URL
 *   3. PUT file bytes directly to S3 (with optional progress reporting)
 *   4. confirmVaultUpload → VaultFile becomes ACTIVE, quota incremented
 *   5. getDownloadUrl → short-lived presigned GET URL for immediate display
 *
 * Returns a ChatAttachment ready to be staged in the message input.
 * Throws ChatMediaUploadError on validation failure or network failure.
 *
 * NOTE: The returned `url` is a short-lived S3 presigned GET URL (~5 min).
 * It is intentionally NOT persisted to IndexedDB — only `fileId` is stored.
 * The ChatAttachmentRenderer uses `useDownloadUrl(fileId)` to refresh URLs on
 * messages older than ~4 minutes.
 */
export async function uploadChatMedia(
  file: File,
  options: UploadChatMediaOptions,
): Promise<ChatAttachment> {
  const {
    projectId,
    workspaceId,
    conversationId,
    token,
    availableBytes = Infinity,
    currentAttachmentCount = 0,
    onProgress,
  } = options

  // ── Step 0: Client-side preflight (instant, no network) ───────────────────
  const validationError = validateEmbeddedUpload(
    file,
    'CHAT',
    VAULT_ALLOWED_MIME_TYPES,
    availableBytes,
    currentAttachmentCount,
  )

  if (validationError) {
    throw new ChatMediaUploadError(getUploadErrorMessage(validationError))
  }

  // ── Steps 1–4: Vault 3-step upload pipeline ───────────────────────────────
  const result = await uploadToVault(
    file,
    {
      workspaceId,
      projectId,
      source: VaultFileSource.Chat,
      sourceId: conversationId,
      name: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    },
    token,
    onProgress,
  )

  // ── Return ChatAttachment ─────────────────────────────────────────────────
  return {
    fileId: result.fileId,
    name: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    url: result.url,
  }
}

// ── Paste event extraction helper (co-located with upload logic) ──────────────

/**
 * Extracts a File from a ClipboardEvent, or returns null for text pastes.
 * Call this inside a textarea's onPaste handler. If it returns a File,
 * call preventDefault() and pass the File to uploadChatMedia().
 *
 * Only returns the first file item in the clipboard.
 * For multi-file paste, the user should use the AttachmentPicker.
 */
export function extractFileFromClipboard(e: ClipboardEvent): File | null {
  const items = Array.from(e.clipboardData?.items ?? [])
  const fileItem = items.find((i) => i.kind === 'file')
  return fileItem?.getAsFile() ?? null
}

// ── Re-export for convenience (callers import from this single file) ──────────
export { CHAT_MAX_ATTACHMENTS }
export type { ChatAttachment }
