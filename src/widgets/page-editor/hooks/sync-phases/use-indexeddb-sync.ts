import { useEffect, useRef, useState } from 'react'
import type * as Y from 'yjs'
import type { IndexeddbPersistence } from 'y-indexeddb'
import { createIndexedDBProvider } from '@/entities/page-session'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:phase2:indexeddb-sync')

/**
 * Phase 2 — IndexedDB Sync
 *
 * Gate: serverSynced must be true (server state wins over stale IDB).
 *
 * Attaches y-indexeddb persistence to the ydoc AFTER the server snapshot
 * has been applied. This means server state always overrides stale offline data,
 * while keeping future local changes persisted automatically.
 *
 * @layer Widgets
 */
export function useIndexedDBSync(
  ydoc: Y.Doc,
  pageId: string,
  serverSynced: boolean,
  onIDBSynced: () => void,
): { idbSynced: boolean } {
  const [idbSynced, setIdbSynced] = useState(false)
  const providerRef = useRef<IndexeddbPersistence | null>(null)
  const attachedRef = useRef(false)

  useEffect(() => {
    if (!serverSynced || attachedRef.current) return
    attachedRef.current = true

    const { provider, synced } = createIndexedDBProvider(pageId, ydoc)
    providerRef.current = provider

    synced.then(() => {
      log.debug('IndexedDB synced', { pageId })
      setIdbSynced(true)
      onIDBSynced()
    })

    return () => {
      provider.destroy().catch((err) => {
        log.error('IndexedDB provider destroy failed', { pageId, err })
      })
      providerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSynced])

  return { idbSynced }
}
