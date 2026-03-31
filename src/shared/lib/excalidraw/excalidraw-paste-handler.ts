/**
 * excalidraw-paste-handler.ts — Whiteboard Vault Upload
 *
 * System Design Decision: Single Pipeline Integration
 *   Instead of intercepting volatile DOM paste events, we inject directly into Excalidraw's
 *   `generateIdForFile` lifecycle. This guarantees 100% coverage across toolbar inserts, drag-and-drop, and Ctrl+V.
 *
 * System Design Decision: Isolated Asset Tracking (`vaultMeta`)
 *   The `y-excalidraw` binding destructively overwrites the CRDT `assets` map on every element change.
 *   To safely track orphan file lifecycles without data loss, we maintain `vaultMeta`—a strictly segregated
 *   Y.Map containing our custom upload state that the binding is blind to.
 *
 * @layer Shared
 */

import { toast } from 'sonner'
import type * as Y from 'yjs'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import {
  confirmVaultUpload,
  getVaultFileUrl,
  registerExternalFile,
} from '@/shared/api/vault'
import { uploadToS3 } from '@/features/vault/upload-file'
import { VaultFileSource } from '@/gql/graphql'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:media:vault-upload')

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const STALE_UPLOAD_AGE_MS = 10 * 60 * 1000   // 10 min

const ALLOWED_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
])

// ── Types ─────────────────────────────────────────────────────────────────────

export type AssetStatus = 'uploading' | 'active' | 'error'

/**
 * System Design Decision: Isolated Metadata Dictionary
 * This defines our parallel state tracker map independent of Excalidraw's native asset map, enabling leak-proof garbage collection diffing.
 */
export interface YAssetEntry {
  mimeType: string
  status: AssetStatus
  created: number
}

/**
 * Context required to create the generateIdForFile function.
 * Pass the same values you'd pass to PasteHandlerContext.
 */
export interface GenerateIdContext {
  ydoc: Y.Doc
  boardId: string
  projectId: string
  workspaceId: string
  excalidrawAPI: ExcalidrawImperativeAPI
  getToken: () => Promise<string | null>
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * System Design Decision: Eager Network Rejection
 * Validates and uploads *before* releasing the file back to Excalidraw. 
 * If the upload fails or the payload exceeds quota, it explicitly throws, effectively aborting the element's render on the canvas.
 * // TODO (Architecture): Refactor setTimeout injection to natively hook into Excalidraw's post-render event when officially exposed.
 */
export function createVaultGenerateIdForFile(ctx: GenerateIdContext) {
  return async function generateIdForFile(file: File): Promise<string> {
    const { ydoc, boardId, projectId, workspaceId, excalidrawAPI, getToken } = ctx

    // ── Validate MIME ─────────────────────────────────────────────────────────
    if (!ALLOWED_IMAGE_MIMES.has(file.type)) {
      const msg =
        file.type
          ? `Unsupported file type "${file.type}". Only JPEG, PNG, GIF, WebP, and SVG are allowed.`
          : 'Unknown file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed.'
      toast.error(msg)
      log.warn('[WB_REJECTED_MIME]', { mimeType: file.type, boardId })
      throw new Error(msg)
    }

    // ── Validate size ─────────────────────────────────────────────────────────
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      const msg = `Image too large — max 10 MB (got ${(file.size / 1024 / 1024).toFixed(1)} MB)`
      toast.error(msg)
      log.warn('[WB_REJECTED_SIZE]', { sizeBytes: file.size, boardId })
      throw new Error(msg)
    }

    // ── Auth ──────────────────────────────────────────────────────────────────
    const token = await getToken()
    if (!token) {
      toast.error('Upload failed: not authenticated')
      throw new Error('Not authenticated')
    }

    const toastId = `wb-upload-${Date.now()}`
    toast.loading('Uploading image\u2026', { id: toastId })

    const vaultMeta = ydoc.getMap<any>('vaultMeta')
    let vaultFileId: string | null = null

    try {
      // ── Step 1: Register with vault → get server-generated fileId ─────────
      const { fileId, presignedUrl } = await registerExternalFile(
        {
          source: VaultFileSource.Whiteboard,
          sourceId: boardId,
          projectId,
          workspaceId,
          name: file.name || `whiteboard-${Date.now()}.${mimeToExt(file.type)}`,
          mimeType: file.type,
          sizeBytes: file.size,
        },
        token,
      )
      vaultFileId = fileId

      log.info('[WB_UPLOAD_START]', {
        vaultFileId,
        mimeType: file.type,
        sizeBytes: file.size,
        name: file.name,
      })

      // System Design Decision: Pre-Registration
      // Crucial synchronization: `vaultMeta` must be committed to the CRDT before `generateIdForFile` returns,
      // guaranteeing `useWhiteboardMediaLifecycle` can detect it if the user instantaneously deletes the block.
      ydoc.transact(() => {
        vaultMeta.set(fileId, {
          mimeType: file.type,
          status: 'uploading',
          created: Date.now(),
        } satisfies YAssetEntry)
      }, 'vault:upload-start')

      // ── Step 3: S3 PUT + confirm ──────────────────────────────────────────
      await uploadToS3(presignedUrl, file, () => {})
      await confirmVaultUpload(fileId, token)

      // ── Step 4: Mark active in vaultMeta ─────────────────────────────────
      ydoc.transact(() => {
        vaultMeta.set(fileId, {
          mimeType: file.type,
          status: 'active',
          created: (vaultMeta.get(fileId) as YAssetEntry | undefined)?.created ?? Date.now(),
        } satisfies YAssetEntry)
      }, 'vault:upload-done')

      const permanentUrl = getVaultFileUrl(fileId)

      // System Design Decision: Event Loop Escapement
      // `setTimeout(0)` guarantees execution *after* Excalidraw computes its synchronous base64 insertion routine.
      // This forces the permanent proxy URL mutation, syncing `yAssets` cleanly for all collaborative peers.
      setTimeout(() => {
        excalidrawAPI.addFiles([
          {
            id: fileId as any,
            mimeType: file.type as any,
            dataURL: permanentUrl as any,
            created: Date.now(),
            lastRetrieved: Date.now(),
          },
        ])
        log.debug('[WB_PROXY_URL_INJECTED]', { vaultFileId: fileId, permanentUrl })
      }, 0)

      toast.success('Image uploaded', { id: toastId })
      log.info('[WB_UPLOAD_DONE]', { vaultFileId: fileId, permanentUrl })

      return fileId
    } catch (err) {
      // Mark error in vaultMeta so recoverStaleUploads can clean it up on next mount
      if (vaultFileId) {
        ydoc.transact(() => {
          const existing = vaultMeta.get(vaultFileId!) as YAssetEntry | undefined
          if (existing) {
            vaultMeta.set(vaultFileId!, { ...existing, status: 'error' } satisfies YAssetEntry)
          }
        }, 'vault:upload-error')
      }

      const message = err instanceof Error ? err.message : 'Upload failed'
      toast.error(`Image upload failed: ${message}`, { id: toastId })
      log.warn('[WB_UPLOAD_FAILED]', { boardId, vaultFileId, err })

      // Rethrow — Excalidraw will not add the element to the canvas
      throw err
    }
  }
}

// ── Stale upload recovery ─────────────────────────────────────────────────────

/**
 * System Design Decision: Zombie Eviction
 * Traverses `vaultMeta` identifying network drops or fatal window closures via a 10-minute STALE_UPLOAD_AGE threshold.
 * Safely marks trapped items as `error` allowing future attempts to succeed.
 */
export function recoverStaleUploads(vaultMeta: Y.Map<any>, ydoc: Y.Doc): void {
  const now = Date.now()
  const staleKeys: Array<string> = []

  for (const [key, value] of vaultMeta.entries()) {
    if (
      value?.status === 'uploading' &&
      typeof value.created === 'number' &&
      now - value.created > STALE_UPLOAD_AGE_MS
    ) {
      staleKeys.push(key)
    }
  }

  if (staleKeys.length === 0) return

  log.info('[WB_STALE_RECOVERY]', {
    count: staleKeys.length,
    keys: staleKeys,
  })

  ydoc.transact(() => {
    for (const key of staleKeys) {
      const existing = vaultMeta.get(key) as YAssetEntry | undefined
      if (existing) {
        vaultMeta.set(key, { ...existing, status: 'error' } satisfies YAssetEntry)
      }
    }
  }, 'vault:stale-recovery')
}

/**
 * // TODO (Architecture): Remove this stub once legacy backward-compatibility layer is fully purged.
 */
export function sanitizeLegacyAssets(_yAssets: Y.Map<any>, _ydoc: Y.Doc): void {
  // Conservative: do nothing
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  }
  return map[mime] ?? 'bin'
}
