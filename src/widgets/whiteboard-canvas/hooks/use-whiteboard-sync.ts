import { useState, useEffect, useRef } from 'react'
import * as Y from 'yjs'
import { ExcalidrawBinding } from '@mizuka-wu/y-excalidraw'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import {
  boardCache,
  uint8ArrayToBase64,
  createYDoc,
} from '@/entities/whiteboard-session' // ✅ Add createYDoc import
import { useBoardSnapshot } from '@/features/whiteboard/fetch-snapshot'
import { useSubscribeBoard } from '@/features/whiteboard/subscribe-board'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:sync')

/**
 * Unified Whiteboard Synchronization Hook
 *
 * Owns Y.Doc, Binding, and all persistence layers.
 * Based on excalidraw-yjs-starter architecture.
 *
 * Flow:
 * 1. Create Y.Doc
 * 2. Load from IndexedDB (instant)
 * 3. Create Binding (Y.Doc ↔ Excalidraw)
 * 4. Fetch GraphQL snapshot (delta if cached)
 * 5. Subscribe to WebSocket
 *
 * @param boardId - Board ID to sync
 * @returns Excalidraw API setter, Y.Doc ref, binding, and ready states
 */
export function useWhiteboardSync(boardId: string) {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null)
  const [binding, setBinding] = useState<ExcalidrawBinding | null>(null)
  const [ready, setReady] = useState(false)
  const [snapshotReady, setSnapshotReady] = useState(false)

  const ydocRef = useRef<Y.Doc | null>(null)
  const bindingRef = useRef<ExcalidrawBinding | null>(null)
  const stateVectorRef = useRef<string | undefined>(undefined)

  // Main initialization effect
  useEffect(() => {
    if (!excalidrawAPI) return

    let isMounted = true

    async function initialize() {
      log.info('🚀 Initializing whiteboard sync', { boardId })

      // 1️⃣ Create Y.Doc with deterministic GUID
      const ydoc = createYDoc({ boardId }) // ✅ Centralized creation!
      ydocRef.current = ydoc

      const yElements = ydoc.getArray<Y.Map<any>>('elements')
      const yAssets = ydoc.getMap('assets')

      // 2️⃣ Load from IndexedDB
      try {
        const cached = await boardCache.load(boardId)

        if (cached && isMounted) {
          Y.applyUpdate(ydoc, cached.snapshot, 'cache')
          stateVectorRef.current = uint8ArrayToBase64(cached.stateVector)

          const elementCount = yElements.length
          log.info('✅ Loaded from IndexedDB cache', {
            boardId,
            size: cached.snapshot.length,
            elementCount,
          })
        } else {
          log.info('ℹ️ No cache found, will fetch full snapshot', { boardId })
        }
      } catch (error) {
        log.error('❌ IndexedDB load failed', { boardId, error })
      }

      if (!isMounted) return

      // 3️⃣ Create Binding
      try {
        log.debug('Creating binding', {
          boardId,
          yElementsLength: yElements.length,
          yAssetsSize: yAssets.size,
          excalidrawAPIExists: !!excalidrawAPI,
        })

        const newBinding = new ExcalidrawBinding(
          yElements,
          yAssets,
          excalidrawAPI,
        )
        bindingRef.current = newBinding
        setBinding(newBinding)

        const elementCount = yElements.length
        log.info('✅ Binding created', {
          boardId,
          elementCount,
          hasData: elementCount > 0,
          bindingType: newBinding.constructor.name,
        })

        setReady(true)
      } catch (error) {
        log.error('❌ Binding creation failed', { boardId, error })
        throw error
      }
    }

    initialize()

    // Cleanup
    return () => {
      isMounted = false

      if (bindingRef.current) {
        log.info('🧹 Destroying binding', { boardId })
        try {
          bindingRef.current.destroy()
        } catch (error) {
          log.error('❌ Binding destroy failed', { boardId, error })
        }
        bindingRef.current = null
      }

      // Save to IndexedDB on unmount
      if (ydocRef.current) {
        try {
          boardCache
            .save(boardId, ydocRef.current)
            .then(() => log.debug('💾 Saved to cache on unmount', { boardId }))
            .catch((error) =>
              log.error('❌ Cache save on unmount failed', { boardId, error }),
            )
        } catch (error) {
          log.error('❌ Cache save on unmount failed', { boardId, error })
        }
      }

      ydocRef.current = null
    }
  }, [excalidrawAPI, boardId])

  // 4️⃣ Fetch GraphQL snapshot (after IndexedDB loaded)
  const { data, error } = useBoardSnapshot(boardId, stateVectorRef.current, {
    enabled: ready,
  })

  // Log GraphQL fetch status
  useEffect(() => {
    if (error) {
      log.error('❌ GraphQL snapshot fetch failed', { boardId, error })
    }
  }, [error, boardId])

  // 5️⃣ Apply GraphQL snapshot
  useEffect(() => {
    if (data?.diff && data.diff.length > 0 && ydocRef.current) {
      try {
        const ydoc = ydocRef.current

        // Apply update
        Y.applyUpdate(ydoc, data.diff, 'remote')

        // Check result
        const elements = ydoc.getArray('elements')
        const updateType = stateVectorRef.current ? 'delta' : 'full'

        log.info('✅ GraphQL snapshot applied', {
          boardId,
          type: updateType,
          size: data.diff.length,
          elementCount: elements.length,
          streamId: data.lastStreamId,
        })

        // Update cache with merged state
        boardCache
          .save(boardId, ydoc, data.lastStreamId || undefined, false)
          .then(() =>
            log.debug('💾 Cache updated after GraphQL sync', { boardId }),
          )
          .catch((err) =>
            log.error('❌ Cache update failed', { boardId, error: err }),
          )

        setSnapshotReady(true)
      } catch (error) {
        log.error('❌ GraphQL snapshot apply failed', { boardId, error })
      }
    }
  }, [data, boardId])

  // 6️⃣ Subscribe to WebSocket (after snapshot ready)
  useSubscribeBoard(boardId, { enabled: snapshotReady })

  // 7️⃣ Setup remote update listener
  useEffect(() => {
    if (!ydocRef.current || !ready) return

    const ydoc = ydocRef.current
    const yElements = ydoc.getArray<Y.Map<any>>('elements')

    const handleRemoteUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        boardId: string
        update: Uint8Array
      }>

      if (customEvent.detail.boardId === boardId) {
        try {
          const beforeCount = yElements.length

          Y.applyUpdate(ydoc, customEvent.detail.update, 'remote')

          const afterCount = yElements.length
          log.debug('✅ Remote update applied', {
            boardId,
            size: customEvent.detail.update.length,
            before: beforeCount,
            after: afterCount,
          })
        } catch (error) {
          log.error('❌ Remote update apply failed', { boardId, error })
        }
      }
    }

    window.addEventListener('board-update', handleRemoteUpdate)

    return () => {
      window.removeEventListener('board-update', handleRemoteUpdate)
    }
  }, [ready, boardId])

  return {
    /**
     * Callback to receive Excalidraw API instance
     */
    setExcalidrawAPI,

    /**
     * Y.Doc instance (for network sync, undo manager, etc.)
     */
    ydoc: ydocRef.current,

    /**
     * ExcalidrawBinding instance
     */
    binding,

    /**
     * True when binding is created and ready
     * ✅ FIX: Don't block on GraphQL - render as soon as binding is created
     * GraphQL snapshot will be applied in background
     */
    ready,

    /**
     * True when GraphQL snapshot has been applied
     * Used to enable WebSocket subscriptions
     */
    snapshotReady,
  }
}
