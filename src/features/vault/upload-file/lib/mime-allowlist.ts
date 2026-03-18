/**
 * MIME type allowlist for client-side upload preflight.
 * Mirrors VAULT_ALLOWED_MIME_PREFIXES + VAULT_BLOCKED_EXTENSIONS from
 * server/src/modules/vault/lib/constants.ts.
 *
 * Update this list whenever the server allowlist changes.
 *
 * @layer Features — upload-file
 */
export const VAULT_ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
  'image/heic',
  'image/avif',
  // Video
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'audio/flac',
  'audio/aac',
  // Documents
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  // Archives
  'application/zip',
  'application/x-tar',
  'application/gzip',
  'application/x-7z-compressed',
  'application/x-rar-compressed',
  // Text & Code
  'text/plain',
  'text/csv',
  'text/markdown',
  'text/html',
  'text/css',
  'text/javascript',
  'application/json',
  'application/xml',
  // Design
  'image/vnd.adobe.photoshop',
  'application/postscript',
  'image/x-xcf',
])

/** Hard limit — matches server VAULT_MAX_FILE_BYTES (50 MB) */
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

/** Max concurrent uploads in flight at once */
export const MAX_CONCURRENT_UPLOADS = 3
