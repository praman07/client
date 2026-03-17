import { useEffect, useRef, useState } from 'react'
import { IndexeddbPersistence } from 'y-indexeddb'
import type * as Y from 'yjs'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:sync:indexeddb')

/**
 * Start IndexedDB persistence after server sync
 * Phase 2 of sync lifecycle
 *
 * @param ydoc - Y.Doc instance
 * @param boardId - Board ID
 * @param serverSynced - Whether server sync completed
 * @param onSynced - Callback when IndexedDB sync completes
 */
export function useIndexedDBSync(
  ydoc: Y.Doc,
  boardId: string,
  serverSynced: boolean,
  onSynced: () => void,
) {
  const persistenceRef = useRef<IndexeddbPersistence | null>(null)
  const [initialized, setInitialized] = useState(false)
  const ydocRef = useRef(ydoc)

  useEffect(() => {
    if (ydocRef.current !== ydoc) {
      log.debug('Y.Doc instance changed, resetting IndexedDB state', {
        boardId,
      })
      setInitialized(false)
      ydocRef.current = ydoc
    }
  }, [ydoc, boardId])

  useEffect(() => {
    if (!serverSynced || initialized) {
      if (!serverSynced) {
        log.debug('⏳ Waiting for server sync before IndexedDB', { boardId })
      }
      return
    }

    log.info('💾 Starting IndexedDB persistence', { boardId })

    const persistence = new IndexeddbPersistence(boardId, ydoc)
    persistenceRef.current = persistence

    persistence.on('synced', () => {
      log.info('✅ IndexedDB synced', { boardId })
      setInitialized(true)
      onSynced()
    })

    persistence.on('error', (error: Error) => {
      log.error('❌ IndexedDB error', { boardId, error })
      persistenceRef.current = null
    })

    return () => {
      log.debug('🧹 Destroying IndexedDB persistence', { boardId })
      persistence.destroy()
      persistenceRef.current = null
    }
  }, [ydoc, boardId, serverSynced, initialized, onSynced])
}
