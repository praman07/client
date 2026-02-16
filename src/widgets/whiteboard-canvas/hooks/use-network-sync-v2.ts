import { useEffect, useRef } from 'react'
import * as Y from 'yjs'
import { useSendBoardUpdate } from '@/features/whiteboard/send-board-update'
import { PendingUpdatesTracker } from '../lib/pending-updates-tracker'
import { isLocalOrigin, isIndexedDBOrigin } from '@/shared/lib/yjs/constants'
import {
  registerYDoc,
  unregisterYDoc,
  registerTracker,
  unregisterTracker,
  subscribeBoard,
  unsubscribeBoard,
} from '@/features/whiteboard/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:network-sync-v2')

/**
 * Network Sync for Y.Doc (Phase 2 - Fixed Deduplication + State Sync)
 *
 * Attaches observers to Y.Doc to send/receive updates via WebSocket.
 * Only activates AFTER state vector sync to prevent divergence.
 *
 * **CRITICAL:** Must wait for state sync before subscribing!
 * - If we subscribe before state sync, remote updates arrive while we're
 *   still applying the GraphQL diff, causing race conditions.
 *
 * Deduplication Strategy:
 * - Track streamIds of updates we send (via ACK)
 * - Skip broadcast updates with our streamIds (echo prevention)
 * - Apply all other updates (remote changes)
 *
 * Flow:
 * - Outgoing: Y.Doc 'update' event → check origin → send if local
 * - ACK: Receive streamId → add to pending tracker
 * - Incoming: Receive broadcast → check tracker → skip if ours, apply if remote
 *
 * @param ydoc - Y.Doc instance from useCollabV2
 * @param boardId - Board ID
 * @param stateSynced - Whether state vector sync completed (gates network sync)
 * @param lastStreamId - Last stream ID from snapshot (for replay gap)
 */
export function useNetworkSyncV2(
  ydoc: Y.Doc | null,
  boardId: string,
  stateSynced: boolean,
  lastStreamId?: string | null,
) {
  const sendUpdate = useSendBoardUpdate(boardId)
  const isSubscribedRef = useRef(false)
  const pendingTracker = useRef(new PendingUpdatesTracker())

  useEffect(() => {
    // Wait for Y.Doc AND state vector sync
    if (!ydoc || !stateSynced) {
      log.debug('Waiting for Y.Doc and state sync', {
        hasYDoc: !!ydoc,
        stateSynced,
      })
      return
    }

    log.info('🌐 Network sync starting', { boardId })

    const tracker = pendingTracker.current

    // ========================================
    // OUTGOING: Y.Doc → WebSocket
    // ========================================
    const handleUpdate = (update: Uint8Array, origin: any) => {
      // log.debug('🔔 Y.Doc update event triggered', {
      //   boardId,
      //   updateSize: update.length,
      //   origin: origin,
      //   originType: typeof origin,
      //   originConstructor: origin?.constructor?.name,
      //   isIndexedDB: isIndexedDBOrigin(origin),
      //   isLocal: isLocalOrigin(origin),
      // })

      // // Log Y.Array state on sender side
      // try {
      //   const yElements = ydoc.getArray('elements')
      //   log.debug('📊 SENDER Y.Array state:', {
      //     boardId,
      //     elementCount: yElements.length,
      //     updateSize: update.length,
      //   })
      // } catch (e) {
      //   log.warn('Could not read Y.Array on sender', e)
      // }

      // Skip updates from IndexedDB restore (already persisted)
      if (isIndexedDBOrigin(origin)) {
        log.debug('⏩ Skipping IndexedDB origin update', { boardId })
        return
      }

      // Only send local updates
      // Note: This check is inclusive - undefined/null are considered local
      if (!isLocalOrigin(origin)) {
        log.debug('⏩ Skipping non-local update', { boardId, origin })
        return
      }

      log.debug('📤 Local update detected, sending to server', {
        boardId,
        updateSize: update.length,
      })

      sendUpdate(update)
    }

    ydoc.on('update', handleUpdate)

    // ========================================
    // INCOMING: WebSocket → Y.Doc
    // ========================================
    // Register Y.Doc and tracker SYNCHRONOUSLY (before subscribing!)
    // This prevents race condition where updates arrive before registration
    registerYDoc(boardId, ydoc, tracker)
    registerTracker(boardId, tracker)
    log.info('✅ Y.Doc and tracker registered', { boardId })

    // Subscribe to board (triggers WebSocket subscription)
    if (!isSubscribedRef.current) {
      subscribeBoard({ boardId, lastStreamId: lastStreamId ?? undefined })
      isSubscribedRef.current = true
      log.info('✅ Subscribed to board updates', { boardId, lastStreamId })
    }

    // Cleanup
    return () => {
      log.info('🔌 Network sync stopping', { boardId })

      // Remove Y.js observer
      ydoc.off('update', handleUpdate)

      // Clear tracker
      tracker.clear()

      // Unregister Y.Doc and tracker
      unregisterYDoc(boardId)
      unregisterTracker(boardId)

      // Unsubscribe from WebSocket
      if (isSubscribedRef.current) {
        unsubscribeBoard(boardId)
        isSubscribedRef.current = false
        log.info('Unsubscribed from board updates', { boardId })
      }
    }
  }, [ydoc, boardId, stateSynced, sendUpdate])
}
