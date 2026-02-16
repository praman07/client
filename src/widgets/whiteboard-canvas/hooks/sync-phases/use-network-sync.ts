import { useEffect, useRef } from 'react'
import * as Y from 'yjs'
import { useSendBoardUpdate } from '@/features/whiteboard/send-board-update'
import { PendingUpdatesTracker } from '../../lib/pending-updates-tracker'
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

const log = createLogger('whiteboard:network-sync')

/**
 * Network Sync Hook - Bidirectional WebSocket sync after state convergence
 *
 * Architecture: Defers WebSocket subscription until after server state sync completes.
 * This prevents race conditions where remote updates arrive during initial GraphQL diff application.
 *
 * Deduplication: Tracks streamIds via ACK to skip echo broadcasts of our own updates.
 *
 * @param ydoc - Y.Doc instance
 * @param boardId - Board ID
 * @param stateSynced - Gates network sync until server snapshot applied
 * @param lastStreamId - Last stream ID from snapshot for replay gap calculation
 */
export function useNetworkSync(
  ydoc: Y.Doc | null,
  boardId: string,
  stateSynced: boolean,
  lastStreamId?: string | null,
) {
  const sendUpdate = useSendBoardUpdate(boardId)
  const isSubscribedRef = useRef(false)
  const pendingTracker = useRef(new PendingUpdatesTracker())

  useEffect(() => {
    if (!ydoc || !stateSynced) {
      log.debug('Waiting for Y.Doc and state sync', {
        hasYDoc: !!ydoc,
        stateSynced,
      })
      return
    }

    log.info('Network sync starting', { boardId })

    const tracker = pendingTracker.current

    const handleUpdate = (update: Uint8Array, origin: any) => {
      if (isIndexedDBOrigin(origin)) {
        log.debug('Skipping IndexedDB origin update', { boardId })
        return
      }

      if (!isLocalOrigin(origin)) {
        log.debug('Skipping non-local update', { boardId, origin })
        return
      }

      log.debug('Local update detected, sending to server', {
        boardId,
        updateSize: update.length,
      })

      sendUpdate(update)
    }

    ydoc.on('update', handleUpdate)

    registerYDoc(boardId, ydoc, tracker)
    registerTracker(boardId, tracker)
    log.info('Y.Doc and tracker registered', { boardId })

    if (!isSubscribedRef.current) {
      subscribeBoard({ boardId, lastStreamId: lastStreamId ?? undefined })
      isSubscribedRef.current = true
      log.info('Subscribed to board updates', { boardId, lastStreamId })
    }

    return () => {
      log.info('Network sync stopping', { boardId })

      ydoc.off('update', handleUpdate)

      tracker.clear()

      unregisterYDoc(boardId)
      unregisterTracker(boardId)

      if (isSubscribedRef.current) {
        unsubscribeBoard(boardId)
        isSubscribedRef.current = false
        log.info('Unsubscribed from board updates', { boardId })
      }
    }
  }, [ydoc, boardId, stateSynced, sendUpdate])
}
