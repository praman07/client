import { useEffect } from 'react'
import { boardCache } from '../lib/board-cache-manager'
import type * as Y from 'yjs'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:cache-hook')

/**
 * Board Cache Hook - Entity Layer
 *
 * Manages board cache lifecycle:
 * - Auto-saves Y.Doc updates to IndexedDB (debounced)
 * - Flushes cache on unmount
 * - Exposes cache operations for manual control
 *
 * @param boardId - Board ID
 * @param ydoc - Y.Doc instance (can be null during initialization)
 *
 * @example
 * const ydoc = useYDocInstance(boardId)
 * const { loadCache, saveCache, clearCache } = useBoardCache(boardId, ydoc)
 *
 * // Manual operations
 * const cached = await loadCache()
 * await saveCache(true) // immediate save
 * await clearCache()
 */
export function useBoardCache(boardId: string, ydoc: Y.Doc | null) {
  // Auto-save on any Y.Doc update (debounced)
  useEffect(() => {
    // Skip if ydoc not yet initialized
    if (!ydoc) {
      return
    }

    const handleUpdate = () => {
      // Debounced save (5s delay)
      boardCache.save(boardId, ydoc, undefined, false)
    }

    ydoc.on('update', handleUpdate)

    log.debug('Cache auto-save enabled', { boardId })

    return () => {
      ydoc.off('update', handleUpdate)

      // 🛡️ FIX: Don't flush cache on unmount
      // React Strict Mode unmounts/remounts causing partial Y.Doc state
      // to be saved. The debounced save will handle persistence.
      log.debug('Cache hook cleanup', { boardId })
    }
  }, [boardId, ydoc])

  return {
    // Note: Snapshot loaded via cache-first strategy (useBoardLoader)
    // Y.Doc is populated by cache or GraphQL delta
    // The y-excalidraw binding auto-syncs to Excalidraw
    /**
     * Load cached snapshot from IndexedDB
     */
    loadCache: () => boardCache.load(boardId),

    /**
     * Save current Y.Doc state to cache
     * @param immediate - If true, save immediately without debouncing
     */
    saveCache: (immediate = false) =>
      ydoc
        ? boardCache.save(boardId, ydoc, undefined, immediate)
        : Promise.resolve(),

    /**
     * Clear cache for this board
     */
    clearCache: () => boardCache.clear(boardId),

    /**
     * Get state vector for delta sync
     */
    getStateVector: () => boardCache.getStateVector(boardId),

    /**
     * Check IndexedDB quota
     */
    checkQuota: () => boardCache.checkQuota(),
  }
}
