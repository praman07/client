/**
 * use-whiteboard-media-lifecycle.ts
 *
 * System Design Decision: Discrete Render Observation
 *   Tracks `yElements` instead of `yAssets` because the Excalidraw binding aggressively preserves 
 *   deleted assets locally to facilitate undo buffers.
 *   This isolated lifecycle hook acts as the authoritative garbage collector for the whiteboard,
 *   diffing rendered canvas elements against the isolated `vaultMeta` history map.
 *
 * @layer Widgets
 */

import { useEffect, useRef } from 'react'
import * as Y from 'yjs'
import { useAuth } from '@/shared/hooks'
import { markFilesUnreferenced, VaultFileSource } from '@/shared/api/vault'
import {
  recoverStaleUploads,
  sanitizeLegacyAssets,
} from '@/shared/lib/excalidraw'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:media:lifecycle')

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * System Design Decision: Orphan Asset Notification
 * Actively diffs canvas removals and dispatches `markFilesUnreferenced` to the server's grace-period queue.
 *
 * @param ydoc    - The shared Y.Doc for this board
 * @param boardId - Board ID (vault entityId)
 */
export function useWhiteboardMediaLifecycle(
  ydoc: Y.Doc,
  boardId: string,
): void {
  const { getToken } = useAuth()
  const savedFileIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const yElements = ydoc.getArray<Y.Map<any>>('elements')
    const yAssets   = ydoc.getMap<any>('assets')
    // System Design Decision: We strictly target `vaultMeta` instead of `yAssets` because the y-binding aggressively destroys our custom schema definitions during its internal diff cycles.
    const vaultMeta = ydoc.getMap<any>('vaultMeta')

    // ── On-mount cleanup tasks ───────────────────────────────────────────────
    recoverStaleUploads(vaultMeta, ydoc)
    sanitizeLegacyAssets(yAssets, ydoc)

    // ── Seed initial fileId set from current canvas state ───────────────────
    savedFileIdsRef.current = getActiveImageFileIds(yElements)
    log.debug('[WB_LIFECYCLE_SEEDED]', {
      boardId,
      count: savedFileIdsRef.current.size,
      fileIds: [...savedFileIdsRef.current],
    })

    // ── Observe yElements for creations, deletions, and undos ───────────────
    const observer = async () => {
      const currentFileIds = getActiveImageFileIds(yElements)
      const previous = savedFileIdsRef.current

      const removed = [...previous].filter((id) => !currentFileIds.has(id))
      const added = [...currentFileIds].filter((id) => !previous.has(id))

      // Log additions first — covers new uploads AND undo restores
      if (added.length > 0) {
        const wasUndo = added.some((id) => {
          const meta = vaultMeta.get(id)
          return meta?.status === 'active' || meta?.status === 'error'
        })

        if (wasUndo) {
          log.info('[WB_ELEMENT_RESTORED]', {
            boardId,
            restoredIds: added,
            // Server cleanup job will detect these IDs still in yElements on
            // next scan and call [UNREF_CLEARED] for any pending unref marks.
          })
        } else {
          log.info('[WB_ELEMENT_CREATED]', {
            boardId,
            fileIds: added,
          })
        }
      }

      if (removed.length === 0) {
        savedFileIdsRef.current = currentFileIds
        return
      }

      log.info('[WB_ELEMENT_DELETED]', { boardId, fileIds: removed })

      // System Design Decision: Safely ignores generic Excalidraw base64 images by intersectionally validating against our persistent `vaultMeta` ledger.
      const vaultManagedIds = new Set(vaultMeta.keys())
      const vaultRemoved = removed.filter((id) => vaultManagedIds.has(id))

      log.info('[WB_VAULT_FILTER]', {
        boardId,
        removed,
        vaultManagedIds: [...vaultManagedIds],
        vaultRemoved,
        filterPassed: vaultRemoved.length > 0,
      })

      if (vaultRemoved.length === 0) {
        // All removed elements were native Excalidraw images — nothing to unref
        savedFileIdsRef.current = currentFileIds
        return
      }

      log.info('[WB_UNREF]', {
        boardId,
        removedIds: vaultRemoved,
        count: vaultRemoved.length,
        statuses: vaultRemoved.map((id) => ({
          fileId: id,
          status: (vaultMeta.get(id) as { status?: string } | undefined)?.status ?? 'missing',
        })),
      })

      savedFileIdsRef.current = currentFileIds

      // Fire-and-forget — never block canvas interaction
      try {
        const token = await getToken()
        if (!token) {
          log.warn('[WB_UNREF_SKIP] No token — skipping markFilesUnreferenced', { boardId })
          return
        }
        await markFilesUnreferenced(
          vaultRemoved,
          boardId,
          VaultFileSource.Whiteboard,
          token,
        )
        log.debug('[WB_UNREF_SENT]', { boardId, removedIds: vaultRemoved })
      } catch (err) {
        log.warn('[WB_UNREF_FAILED]', { boardId, removedIds: vaultRemoved, err })
      }
    }

    yElements.observeDeep(observer)

    return () => {
      yElements.unobserveDeep(observer)
    }
  }, [ydoc, boardId, getToken])
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * System Design Decision: Y.Map Payload Decryption
 * The `y-excalidraw` binding deeply nests elements (e.g., `Y.Map({ el: {...} })`). 
 * Because the user physically removes entries inside the array rather than toggling `isDeleted`, this parses out active pointers manually.
 */
function getActiveImageFileIds(yElements: Y.Array<Y.Map<any>>): Set<string> {
  const ids = new Set<string>()
  for (const wrapper of yElements.toArray()) {
    // el is the raw Excalidraw element plain object inside the Y.Map wrapper
    const el = wrapper.get('el') as Record<string, unknown> | undefined
    if (!el) continue
    if (el['type'] === 'image' && !el['isDeleted'] && typeof el['fileId'] === 'string') {
      ids.add(el['fileId'] as string)
    }
  }
  return ids
}
