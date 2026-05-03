/**
 * Upload limits for embedded contexts (Chat, Pages, Whiteboard, Issues).
 *
 * WHY per-context limits exist:
 *   Large files (long videos, multi-GB archives) must go through the dedicated
 *   Vault UI — not embedded in a chat message or page. These ceilings enforce
 *   that UX contract and protect the real-time pipeline from oversized payloads.
 *
 *   The 50 MB ceiling mirrors VAULT_LIMITS.MAX_FILE_SIZE_BYTES on the server.
 *   The server will reject anything above this anyway — we just fail fast on the
 *   client so the user never waits for a PUT that will be refused.
 *
 * @module shared/lib/upload-limits
 */

// ── Per-context max file size ──────────────────────────────────────────────────

/** Max file size for a single chat attachment (50 MB). Matches server limit. */
export const CHAT_MAX_FILE_BYTES = 50 * 1024 * 1024

/** Max file size in BlockNote editors (Pages + Issues descriptions). */
export const EDITOR_MAX_FILE_BYTES = 50 * 1024 * 1024

/** Max file size for images pasted/dropped into the Whiteboard canvas. */
export const WHITEBOARD_MAX_FILE_BYTES = 50 * 1024 * 1024

// ── Per-message / per-operation limits ────────────────────────────────────────

/** Max number of attachments per chat message. */
export const CHAT_MAX_ATTACHMENTS = 5

// ── Human-readable helpers ────────────────────────────────────────────────────

/** Formats bytes to a readable size string, e.g. "50 MB", "1.2 GB". */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }
  if (bytes >= 1024 * 1024) {
    return `${Math.round(bytes / (1024 * 1024))} MB`
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`
  }
  return `${bytes} B`
}

// ── Quota-aware validation ─────────────────────────────────────────────────────

export type EmbeddedUploadContext = 'CHAT' | 'EDITOR' | 'WHITEBOARD'

const CONTEXT_LIMITS: Record<EmbeddedUploadContext, number> = {
  CHAT: CHAT_MAX_FILE_BYTES,
  EDITOR: EDITOR_MAX_FILE_BYTES,
  WHITEBOARD: WHITEBOARD_MAX_FILE_BYTES,
}

export type EmbeddedUploadValidationError =
  | { kind: 'SIZE_EXCEEDS_CONTEXT_LIMIT'; maxBytes: number; context: EmbeddedUploadContext }
  | { kind: 'SIZE_EXCEEDS_AVAILABLE_QUOTA'; availableBytes: number }
  | { kind: 'MIME_NOT_ALLOWED'; mimeType: string }
  | { kind: 'TOO_MANY_ATTACHMENTS'; max: number; context: 'CHAT' }

/**
 * Validates a file for embedded upload.
 *
 * Two-layer check:
 *   1. Context limit — is the file below the per-context ceiling (50 MB)?
 *      If not: tell user to use Vault directly for large files.
 *   2. Quota check — does the user have enough remaining storage?
 *      If not: tell user their storage is full (or nearly full).
 *
 * @param file           — The File object to validate
 * @param context        — Where the file is being uploaded from
 * @param allowedMimes   — Set of allowed MIME types (from vault allowlist)
 * @param availableBytes — User's remaining storage quota in bytes.
 *                         Pass Infinity if quota is not known yet (skips check).
 * @param currentCount   — Current attachment count (for CHAT context limit enforcement)
 */
export function validateEmbeddedUpload(
  file: File,
  context: EmbeddedUploadContext,
  allowedMimes: Set<string>,
  availableBytes: number,
  currentCount = 0,
): EmbeddedUploadValidationError | null {
  // 1. MIME check — happens before size to give the fastest possible rejection
  if (!allowedMimes.has(file.type)) {
    return { kind: 'MIME_NOT_ALLOWED', mimeType: file.type }
  }

  // 2. Per-context size ceiling
  const contextLimit = CONTEXT_LIMITS[context]
  if (file.size > contextLimit) {
    return { kind: 'SIZE_EXCEEDS_CONTEXT_LIMIT', maxBytes: contextLimit, context }
  }

  // 3. Available storage quota check
  if (file.size > availableBytes) {
    return { kind: 'SIZE_EXCEEDS_AVAILABLE_QUOTA', availableBytes }
  }

  // 4. Attachment count limit (Chat only)
  if (context === 'CHAT' && currentCount >= CHAT_MAX_ATTACHMENTS) {
    return { kind: 'TOO_MANY_ATTACHMENTS', max: CHAT_MAX_ATTACHMENTS, context: 'CHAT' }
  }

  return null
}

/**
 * Converts a validation error into a user-facing message string.
 * Used by toast notifications and inline error displays.
 */
export function getUploadErrorMessage(error: EmbeddedUploadValidationError): string {
  switch (error.kind) {
    case 'SIZE_EXCEEDS_CONTEXT_LIMIT':
      return (
        `File is too large for ${error.context === 'CHAT' ? 'chat attachments' : 'inline uploads'} ` +
        `(max ${formatBytes(error.maxBytes)}). ` +
        `For larger files, upload directly to the Vault.`
      )
    case 'SIZE_EXCEEDS_AVAILABLE_QUOTA':
      return (
        `Not enough storage space. You have ${formatBytes(error.availableBytes)} remaining. ` +
        `Free up space in the Vault or upgrade your plan.`
      )
    case 'MIME_NOT_ALLOWED':
      return `File type not supported: ${error.mimeType || 'unknown'}.`
    case 'TOO_MANY_ATTACHMENTS':
      return `Maximum ${error.max} attachments per message.`
  }
}
