import { useEffect, useRef } from 'react'
import * as Y from 'yjs'
import { useSendBoardUpdate } from '@/features/whiteboard/send-board-update'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:network-sync')

/**
 * Network Sync Hook (Refactored)
 *
 * Listens to Y.Doc changes and sends user edits to backend via WebSocket.
 * Uses Y.mergeUpdates batching for efficiency.
 *
 * Simplified from previous version - only syncs when enabled.
 *
 * @param boardId - Board ID
 * @param ydoc - Y.Doc instance
 * @param enabled - Whether sync is enabled
 */
export function useNetworkSync(
  boardId: string,
  ydoc: Y.Doc | null,
  enabled: boolean = true,
) {
  const sendUpdate = useSendBoardUpdate(boardId)
  const pendingUpdate = useRef<Uint8Array | null>(null)
  const flushScheduled = useRef(false)

  useEffect(() => {
    if (!ydoc || !enabled) {
      log.debug('📡 Network sync disabled', {
        boardId,
        enabled,
        hasYDoc: !!ydoc,
      })
      return
    }

    log.info('✅ Network sync enabled', { boardId })

    const handleUpdate = (update: Uint8Array, origin: any) => {
      // ✅ Only sync user edits from Excalidraw binding
      const isUserEdit = origin?.constructor?.name === 'ExcalidrawBinding'

      if (!isUserEdit) {
        log.debug('⏭️ Skipping non-user update', {
          origin: origin?.constructor?.name || 'unknown',
        })
        return
      }

      // �️ Filter suspiciously small updates
      if (update.length < 50) {
        log.debug('⏭️ Skipping small update', { size: update.length })
        return
      }

      log.debug('✅ User edit detected', { size: update.length })

      // 📦 Batch updates using Y.mergeUpdates
      if (pendingUpdate.current) {
        pendingUpdate.current = Y.mergeUpdates([pendingUpdate.current, update])
      } else {
        pendingUpdate.current = update
      }

      // 📤 Schedule flush (debounced)
      if (!flushScheduled.current) {
        flushScheduled.current = true
        setTimeout(() => {
          if (pendingUpdate.current) {
            const merged = pendingUpdate.current
            pendingUpdate.current = null
            flushScheduled.current = false

            log.debug('📤 Sending merged update', {
              size: merged.length,
              boardId,
            })

            sendUpdate(merged)
          }
        }, 10) // 100ms debounce
      }
    }

    ydoc.on('update', handleUpdate)

    return () => {
      ydoc.off('update', handleUpdate)
      log.debug('🧹 Network sync cleanup', { boardId })
    }
  }, [ydoc, enabled, boardId, sendUpdate])
}
