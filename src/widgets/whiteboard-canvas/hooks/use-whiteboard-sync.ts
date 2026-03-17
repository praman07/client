import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useClientDiff,
  useExcalidrawBinding,
  useIndexedDBSync,
  useNetworkSync,
  useServerSync,
} from './sync-phases'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import type { RefObject } from 'react'
import type { ExcalidrawBinding } from '@mizuka-wu/y-excalidraw'
import { createLogger } from '@/shared/lib/logger'
import { createYDoc } from '@/entities/whiteboard-session'

const log = createLogger('whiteboard:sync')

/**
 * Clean Whiteboard Sync Hook - Single Orchestration Point
 *
 * Sequential Flow:
 * 1. Create Y.Doc with deterministic GUID
 * 2. Fetch & apply server snapshot (useServerSync)
 * 3. Start IndexedDB persistence (useIndexedDBSync)
 * 4. Compute & send client→server diff (useClientDiff)
 * 5. Start network sync (useNetworkSync)
 * 6. Create Excalidraw binding (useExcalidrawBinding)
 *
 * @param boardId - Board ID
 * @param excalidrawAPI - Excalidraw API instance
 * @param excalidrawRef - Ref to Excalidraw container
 * @returns Binding instance and sync states
 */
export function useWhiteboardSync(
  boardId: string,
  excalidrawAPI: ExcalidrawImperativeAPI | null,
  excalidrawRef: RefObject<HTMLElement>,
) {
  // 1. Create Y.Doc (once, with deterministic GUID)
  const [ydoc] = useState(() => createYDoc({ boardId }))

  // Phase states
  const [serverSynced, setServerSynced] = useState(false)
  const [indexeddbSynced, setIndexeddbSynced] = useState(false)
  const [binding, setBinding] = useState<ExcalidrawBinding | null>(null)

  const serverStateVectorRef = useRef<Uint8Array | null>(null)

  // ✅ Cleanup Y.Doc on unmount to prevent memory leaks and state conflicts
  useEffect(() => {
    log.info('📦 Y.Doc created', { boardId, guid: ydoc.guid })

    return () => {
      log.info('🧹 Destroying Y.Doc on unmount', { boardId })
      ydoc.destroy()
    }
  }, [ydoc, boardId])

  // ✅ Stable callbacks (prevent unnecessary re-renders)
  const handleServerSynced = useCallback((serverState: Uint8Array) => {
    serverStateVectorRef.current = serverState
    setServerSynced(true)
  }, [])

  const handleIndexedDBSynced = useCallback(() => {
    setIndexeddbSynced(true)
  }, [])

  // Sync phases (in order)
  useServerSync(ydoc, boardId, handleServerSynced)
  useIndexedDBSync(ydoc, boardId, serverSynced, handleIndexedDBSynced)
  useClientDiff(ydoc, boardId, indexeddbSynced, serverStateVectorRef)
  useNetworkSync(ydoc, boardId, serverSynced)
  useExcalidrawBinding(
    ydoc,
    excalidrawAPI,
    excalidrawRef,
    serverSynced,
    setBinding,
  )

  return { ydoc, binding, serverSynced, indexeddbSynced }
}
