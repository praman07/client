import { MAX_FILE_SIZE_BYTES, VAULT_ALLOWED_MIME_TYPES } from './mime-allowlist'

export type FileValidationError =
  | { kind: 'SIZE_EXCEEDED'; maxBytes: number }
  | { kind: 'MIME_NOT_ALLOWED'; mimeType: string }

/**
 * Client-side preflight validation before calling requestVaultUpload.
 * Returns null if the file is valid, or a typed error to show in the UI.
 *
 * @layer Features — upload-file
 */
export function validateFile(file: File): FileValidationError | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { kind: 'SIZE_EXCEEDED', maxBytes: MAX_FILE_SIZE_BYTES }
  }

  if (!VAULT_ALLOWED_MIME_TYPES.has(file.type)) {
    return { kind: 'MIME_NOT_ALLOWED', mimeType: file.type }
  }

  return null
}
