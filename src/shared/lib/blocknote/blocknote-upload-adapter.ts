/**
 * blocknote-upload-adapter.ts
 *
 * System Design Decision: Centralized Vault Integration
 *   Acts as the unified upload bridge for BlockNote (handling toolbar, drag-drop, and paste natively).
 *   Injects the `uploadToVault` orchestrator without leaking S3/Vault mechanics into the editor logic.
 *
 * System Design Decision: Permanent URL Persistence
 *   Returns a long-lived proxy URL (`getVaultFileUrl`) instead of a raw S3 presigned URL.
 *   This prevents link rot inside the eternal CRDT document, ensuring the asset never expires for future peers.
 *
 * @layer Shared
 */

import { toast } from 'sonner'
import { VAULT_ALLOWED_MIME_TYPES, getVaultFileUrl, uploadToVault } from '@/shared/api/vault'
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
 * System Design Decision: Adapter Factory
 * Returns an asynchronous file-handler directly ingestible by BlockNote.
 * Designed as a factory to lock in strict external context (workspace, project) before rendering.
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

      // System Design Decision: We strictly return the permanent proxy string so the eternal CRDT doesn't calcify dead presigned URLs.
      const permanentUrl = getVaultFileUrl(result.fileId)
      log.debug('[ADAPTER_RETURN]', { permanentUrl, fileId: result.fileId })
      return permanentUrl
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
