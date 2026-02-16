import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { ExcalidrawBinding } from '@mizuka-wu/y-excalidraw'
import { Awareness } from 'y-protocols/awareness'
import { IndexeddbPersistence } from 'y-indexeddb'
import type { RefObject } from 'react'
import { createLogger } from '@/shared/lib/logger'
import { createYDoc } from '@/entities/whiteboard-session' // ✅ Import centralized Y.Doc factory

const log = createLogger('whiteboard:collab-v2')

/**
 * V2 Collaboration Hook (Reference Pattern)
 *
 * Based on excalidraw-yjs-starter implementation.
 * Creates Y.Doc, IndexedDB, Awareness, and Binding all in ONE effect.
 *
 * Key differences from split hooks approach:
 * - Single effect = no timing races
 * - No waiting for sync = Y.js handles it
 * - Stable dependencies [api, boardId] = no unnecessary recreates
 *
 * @param excalidrawRef - Ref to Excalidraw container DOM element/**
 * Phase 1: Y.Doc + IndexedDB + ExcalidrawBinding
 *
 * Creates and manages the core Yjs stack for collaborative whiteboard.
 * Now waits for server sync before starting IndexedDB (correct ordering).
 */
export function useCollabV2(
  excalidrawRef: RefObject<HTMLElement>,
  boardId: string,
  stateSynced: boolean, // ✅ NEW: Whether server sync completed
  serverStateVector: Uint8Array | null, // ✅ NEW: Server state for computing client diff
) {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null)
  const [binding, setBinding] = useState<ExcalidrawBinding | null>(null)
  const [syncReady, setSyncReady] = useState(false) // Phase 2: Track IndexedDB sync
  const ydocRef = useRef<Y.Doc | null>(null) // Phase 2: Expose Y.Doc for network sync

  useEffect(() => {
    // Wait for Excalidraw API only
    if (!api) {
      log.debug('Waiting for Excalidraw API...')
      return
    }

    log.info('Creating Y.js stack for board', { boardId })

    // Create Y.Doc with deterministic GUID
    const ydoc = createYDoc({ boardId }) // ✅ Centralized creation with GUID!
    ydocRef.current = ydoc // Store ref for Phase 2 network sync

    // ✅ CRITICAL: Initialize structure FIRST (before any updates can arrive)
    // This prevents race condition where remote updates arrive before snapshot loads
    // Yjs will merge these with incoming snapshot/updates correctly
    const yElements = ydoc.getArray('elements')
    const yAssets = ydoc.getMap('assets')

    log.debug('✅ Y.Doc structure initialized', {
      boardId,
      hasElements: yElements !== undefined,
      hasAssets: yAssets !== undefined,
    })

    // Awareness for cursor/presence tracking
    const awareness = new Awareness(ydoc)

    // IndexedDB persistence
    const persistence = new IndexeddbPersistence(boardId, ydoc)
    persistence.on('synced', () => {
      log.info('IndexedDB synced for board', { boardId })
      setSyncReady(true)
    })

    // Cleanup
    return () => {
      log.info(
        '[useCollabV2] Cleaning up Y.Doc and IndexedDB for board:',
        boardId,
      )
      setSyncReady(false) // Phase 2: Reset sync state
      ydocRef.current = null // Phase 2: Clear ref
      persistence.destroy()
    }

    // CRITICAL: Only recreate when API or boardId changes!
    // Do NOT add ydoc, excalidrawRef, or any other dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, boardId])

  // Phase 1b: IndexedDB client diff computation (AFTER server sync!)
  useEffect(() => {
    const ydoc = ydocRef.current
    if (!ydoc || !stateSynced || !serverStateVector) {
      return // Wait for server sync
    }

    // TODO: Compute and send client→server diff
    // This will be implemented when we integrate useSendBoardUpdate
    log.debug(
      'Server sync complete, IndexedDB will merge and compute client diff',
      {
        boardId,
        hasServerState: !!serverStateVector,
      },
    )
  }, [ydocRef, boardId, stateSynced, serverStateVector])

  // Phase 1c: Excalidraw Binding (AFTER server sync!)
  useEffect(() => {
    const ydoc = ydocRef.current
    if (!ydoc || !api) return

    // ✅ Wait for server sync (not IndexedDB!) before creating binding
    if (!stateSynced) {
      log.debug('Waiting for server sync before creating binding', {
        boardId,
        stateSynced,
      })
      return
    }

    log.info('Creating Excalidraw binding (after server sync)', { boardId })

    const yElements = ydoc.getArray<Y.Map<any>>('elements')
    const yAssets = ydoc.getMap('assets')
    const awareness = new Awareness(ydoc) // Re-create awareness for this effect's scope

    const undoManagerOptions = excalidrawRef.current
      ? {
          excalidrawDom: excalidrawRef.current,
          undoManager: new Y.UndoManager(yElements),
        }
      : undefined

    const newBinding = new ExcalidrawBinding(
      yElements,
      yAssets,
      api,
      awareness,
      undoManagerOptions,
    )

    setBinding(newBinding)

    log.info('✅ Excalidraw binding created', { boardId })

    return () => {
      log.info('Destroying Excalidraw binding', { boardId })
      newBinding.destroy()
      setBinding(null)
    }
  }, [api, boardId, stateSynced, excalidrawRef])

  return {
    setApi,
    binding,
    ydoc: ydocRef.current, // Phase 2: Expose for network sync
    indexeddbSynced: syncReady, // Phase 2: Expose for state vector sync
  }
}
