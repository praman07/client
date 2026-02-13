import { useEffect, useRef } from 'react'
import * as Y from 'yjs'
import { useYDocInstance } from '@/entities/whiteboard-session'
import { useSendBoardUpdate } from '@/features/whiteboard/send-board-update'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:network-sync')

/**
 * Network sync hook for Y.Doc updates
 *
 * Listens to Y.Doc changes (triggered by y-excalidraw) and sends to backend via WebSocket.
 * Uses Y.mergeUpdates batching for efficiency (100x fewer network calls).
 *
 * Layer 3 Protection: Deduplication with SHA-256 fingerprinting (future enhancement).
 *
 * @layer Widgets
 * @module whiteboard-canvas
 */
export function useNetworkSync(boardId: string, enabled: boolean = true) {
  const { ydoc } = useYDocInstance(boardId)
  const sendUpdate = useSendBoardUpdate(boardId)

  const pendingUpdate = useRef<Uint8Array | null>(null)
  const flushScheduled = useRef(false)

  useEffect(() => {
    if (!ydoc || !enabled) {
      log.debug('📡 Network sync disabled or waiting', { boardId, enabled })
      return
    }

    const handleUpdate = (update: Uint8Array, origin: string | undefined) => {
      // ✅ CRITICAL FIX: y-excalidraw doesn't set origin explicitly
      // We need to send updates that:
      // 1. Have no origin (undefined) - from y-excalidraw library
      // 2. Have origin='local' - explicit local changes
      //
      // But skip:
      // - origin='remote' - updates from WebSocket
      // - origin='snapshot' - initial state load
      
      log.debug('📡 Y.Doc update event', {
        origin: origin ?? 'undefined',
        size: update.length,
      })
      
      if (origin === 'remote' || origin === 'snapshot') {
        log.debug('⏭️ Skipping non-local update', { origin })
        return
      }

      // ✅ Send updates with no origin or origin='local'
      log.debug('✅ Processing update for network sync', { origin: origin ?? 'undefined' })

      // ✅ Batch updates using Y.mergeUpdates
      // Rapid onChange events → single network message
      if (pendingUpdate.current) {
        pendingUpdate.current = Y.mergeUpdates([pendingUpdate.current, update])
      } else {
        pendingUpdate.current = update
      }

      // ✅ Schedule flush using microtask
      // Groups all synchronous Y.Doc changes before sending
      if (!flushScheduled.current) {
        flushScheduled.current = true
        queueMicrotask(() => {
          if (pendingUpdate.current) {
            log.debug('📤 Sending merged update', {
              size: pendingUpdate.current.length,
              boardId,
            })

            sendUpdate(pendingUpdate.current)
            pendingUpdate.current = null
            flushScheduled.current = false
          }
        })
      }
    }

    ydoc.on('update', handleUpdate)

    log.debug('📡 Network sync initialized', { boardId })

    return () => {
      log.debug('🧹 Network sync cleanup', { boardId })
      ydoc.off('update', handleUpdate)
    }
  }, [ydoc, sendUpdate, boardId, enabled])
}
