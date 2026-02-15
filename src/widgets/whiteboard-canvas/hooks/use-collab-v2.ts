import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { ExcalidrawBinding } from '@mizuka-wu/y-excalidraw'
import { Awareness } from 'y-protocols/awareness'
import { IndexeddbPersistence } from 'y-indexeddb'
import type { RefObject } from 'react'

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
 * @param excalidrawRef - Ref to Excalidraw container DOM element
 * @param boardId - Unique board identifier
 * @returns setApi callback and binding instance
 */
export function useCollabV2(
  excalidrawRef: RefObject<HTMLElement>,
  boardId: string,
) {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null)
  const [binding, setBinding] = useState<ExcalidrawBinding | null>(null)
  const [syncReady, setSyncReady] = useState(false) // Phase 2: Track IndexedDB sync
  const ydocRef = useRef<Y.Doc | null>(null) // Phase 2: Expose Y.Doc for network sync

  useEffect(() => {
    // Wait for Excalidraw API only
    if (!api) {
      console.log('[useCollabV2] Waiting for Excalidraw API...')
      return
    }

    console.log('[useCollabV2] Creating Y.js stack for board:', boardId)

    // Create Y.Doc
    const ydoc = new Y.Doc()
    ydocRef.current = ydoc // Store ref for Phase 2 network sync

    const yElements = ydoc.getArray<Y.Map<any>>('elements')
    const yAssets = ydoc.getMap('assets')

    // IndexedDB persistence - NO WAITING!
    // Y.js will handle sync automatically
    const indexeddbPersistence = new IndexeddbPersistence(
      `collabify-board-${boardId}`,
      ydoc,
    )

    // Log when synced (for debugging)
    indexeddbPersistence.on('synced', () => {
      console.log('[useCollabV2] IndexedDB synced for board:', boardId)
      setSyncReady(true) // Phase 2: Signal network sync can start
    })

    indexeddbPersistence.on('error', (error: Error) => {
      console.error('[useCollabV2] IndexedDB error:', error)
    })

    // Awareness for cursor/presence tracking
    const awareness = new Awareness(ydoc)

    // Undo manager (if DOM is ready)
    const undoManagerOptions = excalidrawRef.current
      ? {
          excalidrawDom: excalidrawRef.current,
          undoManager: new Y.UndoManager(yElements),
        }
      : undefined

    // Create binding immediately (trust Y.js to handle sync)
    const newBinding = new ExcalidrawBinding(
      yElements,
      yAssets,
      api,
      awareness,
      undoManagerOptions,
    )

    console.log('[useCollabV2] ✅ Binding created successfully')
    setBinding(newBinding)

    // Cleanup
    return () => {
      console.log('[useCollabV2] Cleaning up for board:', boardId)
      setSyncReady(false) // Phase 2: Reset sync state
      ydocRef.current = null // Phase 2: Clear ref
      setBinding(null)
      newBinding.destroy()
      indexeddbPersistence.destroy()
    }

    // CRITICAL: Only recreate when API or boardId changes!
    // Do NOT add ydoc, excalidrawRef, or any other dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, boardId])

  return {
    setApi,
    binding,
    ydoc: ydocRef.current, // Phase 2: Expose for network sync
    syncReady, // Phase 2: Expose sync state
  }
}
