import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import type { RefObject } from 'react'
import { IndexeddbPersistence } from 'y-indexeddb'
import { Awareness } from 'y-protocols/awareness'
import { ExcalidrawBinding } from '@mizuka-wu/y-excalidraw'
import { createLogger } from '@/shared/lib/logger'
import { createYDoc } from '@/entities/whiteboard-session'
import { useBoardSnapshot } from '@/features/whiteboard/fetch-snapshot'
import { uint8ArrayToBase64 } from '@/entities/whiteboard-session'
import { safeApplyUpdate } from '@/shared/lib/yjs/safe-apply-update'
import { YjsOrigin } from '@/shared/lib/yjs/constants'
import { useSendBoardUpdate } from '@/features/whiteboard/send-board-update'
import { useNetworkSyncV2 } from './use-network-sync-v2'

const log = createLogger('whiteboard:sync-v2')

/**
 * Clean Whiteboard Sync Hook - Single Orchestration Point
 *
 * Sequential Flow:
 * 1. Create Y.Doc with deterministic GUID
 * 2. Fetch & apply server snapshot
 * 3. Start IndexedDB persistence
 * 4. Compute & send client→server diff (offline edits)
 * 5. Start network sync (WebSocket)
 * 6. Create Excalidraw binding
 *
 * @param boardId - Board ID
 * @param excalidrawAPI - Excalidraw API instance
 * @param excalidrawRef - Ref to Excalidraw container
 * @returns Binding instance and sync states
 */
export function useWhiteboardSyncV2(
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

  // 2. Server Sync (runs immediately)
  useServerSync(ydoc, boardId, handleServerSynced)

  // 3. IndexedDB (after server sync)
  useIndexedDBSync(ydoc, boardId, serverSynced, handleIndexedDBSynced)

  // 4. Send client diff (after IndexedDB)
  useClientDiff(ydoc, boardId, indexeddbSynced, serverStateVectorRef)

  // 5. Network sync (after server sync)
  useNetworkSyncV2(ydoc, boardId, serverSynced)

  // 6. Binding (after server sync)
  useExcalidrawBinding(
    ydoc,
    excalidrawAPI,
    excalidrawRef,
    serverSynced,
    setBinding,
  )

  return { ydoc, binding, serverSynced, indexeddbSynced }
}

// ============================================================================
// Helper Hooks (Internal, Focused)
// ============================================================================

/**
 * Fetch and apply server snapshot diff
 */
function useServerSync(
  ydoc: Y.Doc,
  boardId: string,
  onSynced: (serverStateVector: Uint8Array) => void,
) {
  const [synced, setSynced] = useState(false)
  const ydocRef = useRef(ydoc)

  // ✅ Reset synced when Y.Doc instance changes (new instance on remount)
  useEffect(() => {
    if (ydocRef.current !== ydoc) {
      log.debug('🔄 Y.Doc instance changed, resetting sync state', { boardId })
      setSynced(false)
      ydocRef.current = ydoc
    }
  }, [ydoc, boardId])

  // Encode client snapshot (current Y.Doc state)
  const clientSnapshot = useMemo(
    () => uint8ArrayToBase64(Y.encodeStateAsUpdate(ydoc)),
    [ydoc],
  )

  // Fetch server diff (always enabled, rely on refetchOnMount)
  const { data, isSuccess } = useBoardSnapshot(boardId, clientSnapshot, {
    retry: 2,
    retryDelay: 1000,
  })

  // Apply diff once
  useEffect(() => {
    if (synced || !isSuccess || !data?.diff) return

    log.info('📥 Applying server snapshot', {
      boardId,
      diffSize: data.diff.length,
    })

    // Apply server diff
    const result = safeApplyUpdate(
      ydoc,
      data.diff,
      {
        context: 'server-sync',
        boardId,
        origin: YjsOrigin.Remote,
        throwOnError: true,
      },
      log,
    )

    if (result.success) {
      // ✅ Capture server state AFTER applying diff
      // This allows us to later compute: clientDiff = Y.encodeStateAsUpdate(ydoc, serverState)
      // where ydoc = server state + offline edits (from IndexedDB)
      // and serverState = just server state
      // Result: clientDiff = just offline edits
      const serverState = Y.encodeStateVector(ydoc)

      log.info('✅ Server sync complete', {
        boardId,
        elementsBefore: result.elementsBefore,
        elementsAfter: result.elementsAfter,
      })

      setSynced(true)
      onSynced(serverState)
    } else {
      log.error('❌ Server sync failed', { boardId, error: result.error })
      // Still mark as synced for graceful degradation
      const serverState = Y.encodeStateVector(ydoc)
      setSynced(true)
      onSynced(serverState)
    }
  }, [data, isSuccess, synced, ydoc, boardId, onSynced])
}

/**
 * Start IndexedDB persistence after server sync
 */
function useIndexedDBSync(
  ydoc: Y.Doc,
  boardId: string,
  serverSynced: boolean,
  onSynced: () => void,
) {
  const persistenceRef = useRef<IndexeddbPersistence | null>(null)
  const [initialized, setInitialized] = useState(false)
  const ydocRef = useRef(ydoc)

  // ✅ Reset initialized when Y.Doc instance changes
  useEffect(() => {
    if (ydocRef.current !== ydoc) {
      log.debug('🔄 Y.Doc instance changed, resetting IndexedDB state', {
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
      persistenceRef.current = null // ✅ Clear ref on error
    })

    return () => {
      log.debug('🧹 Destroying IndexedDB persistence', { boardId })
      persistence.destroy()
      persistenceRef.current = null
    }
  }, [ydoc, boardId, serverSynced, initialized, onSynced])
}

/**
 * Calculate and send client→server diff (offline edits)
 */
function useClientDiff(
  ydoc: Y.Doc,
  boardId: string,
  indexeddbSynced: boolean,
  serverStateVectorRef: RefObject<Uint8Array | null>,
) {
  const sendUpdate = useSendBoardUpdate(boardId)
  const [sent, setSent] = useState(false)
  const ydocRef = useRef(ydoc)

  // ✅ Reset sent when Y.Doc instance changes
  useEffect(() => {
    if (ydocRef.current !== ydoc) {
      log.debug('🔄 Y.Doc instance changed, resetting client diff state', {
        boardId,
      })
      setSent(false)
      ydocRef.current = ydoc
    }
  }, [ydoc, boardId])

  useEffect(() => {
    const serverStateVector = serverStateVectorRef.current
    if (!indexeddbSynced || !serverStateVector || sent) {
      return
    }

    log.debug('🧮 Computing client→server diff', { boardId })

    // Compute what client has that server doesn't
    const clientDiff = Y.encodeStateAsUpdate(ydoc, serverStateVector)

    if (clientDiff.length > 0) {
      log.info('📤 Sending offline edits to server', {
        boardId,
        diffSize: clientDiff.length,
      })

      sendUpdate(clientDiff)
    } else {
      log.debug('No offline edits to send', { boardId })
    }

    setSent(true)
  }, [ydoc, boardId, indexeddbSynced, serverStateVectorRef, sent, sendUpdate])
}

/**
 * Create Excalidraw binding after server sync
 */
function useExcalidrawBinding(
  ydoc: Y.Doc,
  api: ExcalidrawImperativeAPI | null,
  excalidrawRef: RefObject<HTMLElement>,
  serverSynced: boolean,
  setBinding: (binding: ExcalidrawBinding | null) => void,
) {
  useEffect(() => {
    if (!api || !serverSynced) {
      log.debug('⏳ Waiting for API and server sync before binding', {
        hasAPI: !!api,
        serverSynced,
      })
      return
    }

    log.info('🔗 Creating Excalidraw binding', {})

    const yElements = ydoc.getArray<Y.Map<any>>('elements')
    const yAssets = ydoc.getMap('assets')
    const awareness = new Awareness(ydoc)

    const undoManagerOptions = excalidrawRef.current
      ? {
          excalidrawDom: excalidrawRef.current,
          undoManager: new Y.UndoManager(yElements),
        }
      : undefined

    const binding = new ExcalidrawBinding(
      yElements,
      yAssets,
      api,
      awareness,
      undoManagerOptions,
    )

    setBinding(binding)

    log.info('✅ Excalidraw binding created', {})

    return () => {
      log.debug('🧹 Destroying Excalidraw binding', {})
      binding.destroy()
      setBinding(null)
    }
  }, [ydoc, api, serverSynced, excalidrawRef, setBinding])
}
