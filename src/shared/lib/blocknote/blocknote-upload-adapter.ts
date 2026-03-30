/**
 * blocknote-upload-adapter.ts
 *
 * Factory that produces the `uploadFile` function BlockNote expects.
 *
 * BlockNote's `uploadFile` editor option is the SINGLE entry point for all
 * file insertions — slash command, paste, and drag-and-drop. We bridge it to
 * the shared Vault 3-step pipeline (`uploadToVault`) without exposing any Vault
 * internals to the editor.
 *
 * URL persistence strategy — `vault://` scheme:
 *   BlockNote stores whatever string `uploadFile` returns as the image node's
 *   `url` attribute inside the YJS document. Presigned GET URLs expire in 1
 *   hour, breaking persistent documents. To avoid this we return a stable
 *   opaque reference: `vault://<fileId>`.
 *
 *   The `blocknote-url-refresher` resolves these references to real presigned
 *   URLs — both on editor mount (existing content) and immediately after each
 *   upload (new content), via `editor.onChange`.
 *
 * @layer Shared → lib/blocknote
 */

import { toast } from 'sonner'
import { VAULT_ALLOWED_MIME_TYPES, uploadToVault } from '@/shared/api/vault'
import { VaultFileSource } from '@/gql/graphql'
import {
  getUploadErrorMessage,
  validateEmbeddedUpload,
} from '@/shared/lib/upload-limits'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('shared:blocknote:upload-adapter')

// ── Types ────────────────────────────────────────────────────────────────────

export interface BlockNoteUploadAdapterOptions {
  workspaceId: string
  projectId: string
  /** 'PAGE' for the page editor, 'TASK' for the issue description editor. */
  source: 'PAGE' | 'TASK'
  /** The entity ID this file is attached to (pageId or issueId). */
  sourceId: string
  /**
   * Lazy token getter — called at upload time, not at factory creation time.
   * Pass `useAuth().getToken` from the calling component.
   */
  getToken: () => Promise<string | null>
}

/** Thrown when client-side preflight validation fails (MIME, size, quota). */
export class BlockNoteUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BlockNoteUploadError'
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

/**
 * Returns a `(file: File) => Promise<string>` ready to pass to
 * `useCreateBlockNote({ uploadFile: adapter })`.
 *
 * The returned string is ALWAYS a `vault://<fileId>` reference — never a raw
 * presigned URL — so the YJS document remains valid after the 1-hour URL TTL.
 *
 * After `uploadFile` resolves, the editor writes `vault://<fileId>` into the
 * block and renders an image. The caller MUST subscribe via `editor.onChange`
 * and call `refreshVaultUrls(editor, getToken)` to resolve the opaque ref to a
 * live URL — making the image visible without a page reload.
 */
export function createBlockNoteUploadAdapter(
  options: BlockNoteUploadAdapterOptions,
): (file: File) => Promise<string> {
  const { workspaceId, projectId, source, sourceId, getToken } = options

  return async (file: File): Promise<string> => {
    const toastId = `upload-${file.name}-${Date.now()}`

    // ── Step 0: Preflight (instant, no network) ──────────────────────────────
    const validationError = validateEmbeddedUpload(
      file,
      'EDITOR',
      VAULT_ALLOWED_MIME_TYPES,
      Infinity, // quota check skipped — server enforces atomically
    )

    if (validationError) {
      const msg = getUploadErrorMessage(validationError)
      toast.error(msg)
      throw new BlockNoteUploadError(msg)
    }

    // ── Step 1: Auth ─────────────────────────────────────────────────────────
    const token = await getToken()
    if (!token) {
      const msg = 'Not authenticated. Please refresh and try again.'
      toast.error(msg)
      throw new BlockNoteUploadError(msg)
    }

    // ── Steps 2–4: Vault pipeline ────────────────────────────────────────────
    const vaultSource =
      source === 'PAGE' ? VaultFileSource.Page : VaultFileSource.Task

    log.debug('[UPLOAD_START]', { fileName: file.name, size: file.size, source, sourceId })
    toast.loading(`Uploading ${file.name}…`, { id: toastId })

    try {
      const result = await uploadToVault(
        file,
        {
          workspaceId,
          projectId,
          source: vaultSource,
          sourceId,
          name: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        },
        token,
        (percent) => {
          log.debug('[UPLOAD_PROGRESS]', { fileName: file.name, percent })
          toast.loading(`Uploading ${file.name}… ${percent}%`, { id: toastId })
        },
      )

      log.debug('[UPLOAD_SUCCESS]', { fileId: result.fileId, fileName: file.name })
      toast.success(`${file.name} ready`, { id: toastId })

      const vaultRef = `vault://${result.fileId}`
      log.debug('[ADAPTER_RETURN]', { vaultRef })
      return vaultRef
    } catch (err) {
      const msg =
        err instanceof BlockNoteUploadError
          ? err.message
          : `Failed to upload ${file.name}`
      log.error('[UPLOAD_FAILED]', { fileName: file.name, error: err })
      toast.error(msg, { id: toastId })
      throw err instanceof BlockNoteUploadError
        ? err
        : new BlockNoteUploadError(msg)
    }
  }
}
