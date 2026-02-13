import { useEffect, useRef } from 'react'
import * as Y from 'yjs'
import type { Doc as YDoc } from 'yjs'
import { createYDoc, destroyYDoc } from '../lib/ydoc-manager'
import { useBoardSnapshot } from '@/features/whiteboard/fetch-snapshot'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:ydoc-instance')

/**
 * Get or create Y.Doc instance for a board
 *
 * RESPONSIBILITIES:
 * 1. Create Y.Doc instance (singleton per boardId)
 * 2. Apply snapshot on initialization (if available)
 * 3. Destroy Y.Doc on unmount
 * 4. Signal when snapshot is ready for subscriptions
 *
 * CRITICAL: snapshotReady flag prevents race condition where
 * WebSocket deltas arrive before snapshot is applied.
 *
 * @param boardId - Board ID to get Y.Doc for
 * @returns Object with ydoc instance and snapshotReady flag
 */
export function useYDocInstance(boardId: string | null): {
  ydoc: YDoc | null
  snapshotReady: boolean
} {
  const ydocRef = useRef<YDoc | null>(null)
  const { data: snapshot } = useBoardSnapshot(boardId || '', undefined, {
    enabled: !!boardId,
  })
  const snapshotAppliedRef = useRef(false)

  useEffect(() => {
    if (!boardId) {
      if (ydocRef.current) {
        destroyYDoc(boardId!)
        ydocRef.current = null
        snapshotAppliedRef.current = false
      }
      return
    }

    const ydoc = createYDoc(boardId)
    ydocRef.current = ydoc

    return () => {
      destroyYDoc(boardId)
      ydocRef.current = null
      snapshotAppliedRef.current = false
    }
  }, [boardId])

  // Apply snapshot when available (only once)
  useEffect(() => {
    if (!ydocRef.current || !snapshot?.diff || snapshotAppliedRef.current) {
      return
    }

    log.debug('Applying snapshot', {
      boardId,
      snapshotSize: snapshot.diff.length,
      lastStreamId: snapshot.lastStreamId,
    })

    try {
      // ✅ CRITICAL: Check if snapshot has old structure (Y.Map)
      // Old snapshots from custom binding are incompatible with y-excalidraw
      // Just skip them and start fresh
      const tempDoc = new Y.Doc()
      Y.applyUpdate(tempDoc, snapshot.diff)

      const elementsInSnapshot = tempDoc.get('elements')

      if (elementsInSnapshot instanceof Y.Map) {
        log.warn('⚠️ Skipping old snapshot with Y.Map structure', {
          boardId,
          snapshotSize: snapshot.diff.length,
        })
        // Mark as applied so we don't try again, but don't actually apply
        snapshotAppliedRef.current = true
        tempDoc.destroy()

        log.debug('✅ Ready for y-excalidraw with fresh Y.Doc', { boardId })
        return
      }

      tempDoc.destroy()

      // ✅ Snapshot has correct structure or is empty - apply it
      // Pass 'snapshot' origin to distinguish from local/remote updates
      Y.applyUpdate(ydocRef.current, snapshot.diff, 'snapshot')
      snapshotAppliedRef.current = true

      log.debug('✅ Snapshot applied, ready for subscription', {
        boardId,
      })
    } catch (error) {
      log.error('Failed to apply snapshot', error)
      // Mark as applied anyway to prevent infinite retries
      snapshotAppliedRef.current = true
    }
  }, [snapshot, boardId])

  return {
    ydoc: ydocRef.current,
    snapshotReady: snapshotAppliedRef.current,
  }
}
