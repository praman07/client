import { useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { useServerSync } from './sync-phases/use-server-sync'
import { useIndexedDBSync } from './sync-phases/use-indexeddb-sync'
import { useClientDiff } from './sync-phases/use-client-diff'
import { useNetworkSync } from './sync-phases/use-network-sync'
import { PageAwarenessProvider, createPageDoc, selectIsPageLocked  } from '@/entities/page-session'
import { assignColor } from '@/entities/page-presence'
import { useAppSelector, useUser } from '@/shared/hooks'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:use-page-sync')

export interface PageSyncResult {
  ydoc: Y.Doc
  awarenessProvider: PageAwarenessProvider
  serverSynced: boolean
  isLocked: boolean
}

/**
 * usePageSync — 5-Phase Sync Orchestrator (Phases 1–4 only)
 *
 * Owns the Y.Doc and AwarenessProvider lifecycle.
 * Phase 5 (Tiptap binding) lives in PageEditorBody — a child component
 * that only mounts when serverSynced=true — to prevent CollaborationCursor
 * from reading provider.doc before the Y.Doc is ready.
 *
 * @layer Widgets
 */
export function usePageSync(pageId: string): PageSyncResult {
  const { user: currentUser } = useUser()
  const isLocked = useAppSelector(selectIsPageLocked)

  const ydoc = useMemo(() => {
    log.debug('Creating Y.Doc', { pageId })
    return createPageDoc({ pageId })
     
  }, [pageId])

  const awarenessProvider = useMemo(() => {
    const color = currentUser?.id ? assignColor(currentUser.id) : '#6366f1'
    const name = currentUser?.fullName ?? 'Anonymous'
    return new PageAwarenessProvider(ydoc, pageId, { name, color })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, ydoc])

  // Use a ref so Effect A in useNetworkSync always reads the real lastStreamId
  // at fire-time, not the potentially-stale '0-0' initial state value.
  const lastStreamIdRef = useRef('0-0')
  const serverStateVectorRef = useRef<Uint8Array | null>(null)

  const handleServerSynced = (streamId: string) => {
    lastStreamIdRef.current = streamId
    serverStateVectorRef.current = Y.encodeStateVector(ydoc)
  }

  const { serverSynced } = useServerSync(ydoc, pageId, handleServerSynced)

  const [idbSynced, setIdbSynced] = useState(false)
  useIndexedDBSync(ydoc, pageId, serverSynced, () => setIdbSynced(true))

  useClientDiff(ydoc, pageId, idbSynced, serverStateVectorRef)

  useNetworkSync(ydoc, pageId, serverSynced, lastStreamIdRef)

  return { ydoc, awarenessProvider, serverSynced, isLocked }
}
