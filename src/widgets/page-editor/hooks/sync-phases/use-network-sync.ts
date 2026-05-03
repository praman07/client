import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type * as Y from 'yjs'
import type { RefObject } from 'react'
import {
  registerPageHandlers,
  registerPageYDoc,
  subscribePage,
  unregisterPageYDoc,
  unsubscribePage,
} from '@/features/pages/events'
import {
  selectPageConnectionStatus,
  setActivePageId, setConnectionStatus 
} from '@/entities/page-session'
import { useSendPageUpdate } from '@/features/pages/send-page-update'
import { useAppDispatch, useAppSelector, useUser } from '@/shared/hooks'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:phase4:network-sync')

const INDEXEDDB_ORIGIN = 'y-indexeddb'

/**
 * Phase 4 — Network Sync (WebSocket)
 *
 * TWO-EFFECT PATTERN (matches whiteboard's stateSynced gate):
 *
 * Effect A (serverSynced):
 *   - Registers ydoc in the handler registry
 *   - Registers WS event handlers
 *   - Emits page:subscribe with lastStreamId for gap-fill
 *   - Sets connectionStatus → 'connecting'
 *
 * Effect B (connectionStatus === 'connected'):
 *   - Only fires AFTER page:subscribe-success arrives (server confirmed subscription)
 *   - Attaches ydoc.on('update') → sendPageUpdate
 *   - This prevents the race where BlockNote's Yjs init update fires BEFORE
 *     the server has completed ZADD in track-presence, causing NOT_SUBSCRIBED rejection.
 *
 * @layer Widgets
 */
export function useNetworkSync(
  ydoc: Y.Doc,
  pageId: string,
  serverSynced: boolean,
  lastStreamIdRef: RefObject<string>,
): void {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { user: currentUser } = useUser()
  const connectionStatus = useAppSelector(selectPageConnectionStatus)
  const sendPageUpdate = useSendPageUpdate(pageId)

  // ─── Effect A: Subscribe ─────────────────────────────────────────────────
  // Runs once serverSynced=true. Registers the ydoc, registers WS handlers,
  // emits page:subscribe. Does NOT attach ydoc.on('update') yet — that's
  // gated behind subscribe-success (Effect B).
  useEffect(() => {
    if (!serverSynced) return

    log.info('Phase 4A: Registering and subscribing', {
      pageId,
      lastStreamId: lastStreamIdRef.current,
    })

    // Register ydoc so WS update handlers can apply remote updates
    registerPageYDoc(pageId, ydoc)

    // Register all downstream WS event handlers (subscribe-success, page-update, etc.)
    const unregisterHandlers = registerPageHandlers({
      dispatch,
      queryClient,
      userId: currentUser?.id ?? null,
    })

    // Emit page:subscribe — server will respond with page:subscribe-success
    dispatch(setConnectionStatus('connecting'))
    dispatch(setActivePageId(pageId))
    // Read ref at fire-time — always the real lastStreamId from the snapshot,
    // never the '0-0' initial value even if state batching delayed the setter.
    subscribePage(pageId, lastStreamIdRef.current)

    return () => {
      log.info('Phase 4A: Cleanup — unsubscribing', { pageId })
      unregisterHandlers()
      unregisterPageYDoc(pageId)
      unsubscribePage(pageId)
      dispatch(setConnectionStatus('disconnected'))
      dispatch(setActivePageId(null))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSynced, pageId])

  // ─── Effect B: Send Updates (gated on subscribe-success) ─────────────────
  // Only runs after server confirms subscription via page:subscribe-success,
  // which sets connectionStatus → 'connected'. This prevents sending ydoc
  // updates before the server has registered the user in the subscriber set.
  useEffect(() => {
    if (connectionStatus !== 'connected') return

    log.info('Phase 4B: Subscribe confirmed — attaching update listener', {
      pageId,
    })

    const handleUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === INDEXEDDB_ORIGIN) return
      if (origin === 'server' || origin === 'remote') return

      log.debug('Local update → sending to server', {
        pageId,
        size: update.byteLength,
      })
      sendPageUpdate(update).catch((err) => {
        log.error('Failed to send update', { pageId, err })
      })
    }

    ydoc.on('update', handleUpdate)
    log.debug('Update listener attached', { pageId })

    return () => {
      ydoc.off('update', handleUpdate)
      log.debug('Update listener detached', { pageId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStatus, pageId])
}
