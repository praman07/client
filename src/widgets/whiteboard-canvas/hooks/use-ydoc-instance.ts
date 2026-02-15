import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import {
  createYDoc,
  createIndexedDBProvider,
  type YDocConfig,
} from '@/entities/whiteboard-session'

/**
 * React hook to manage Y.Doc lifecycle for a whiteboard board
 *
 * Handles:
 * - Y.Doc creation and configuration
 * - IndexedDB persistence setup
 * - Cleanup on unmount
 *
 * @param boardId - Unique board identifier
 * @param config - Optional Y.Doc configuration
 * @returns Y.Doc instance and sync status
 */
export function useYDocInstance(boardId: string, config?: Partial<YDocConfig>) {
  const ydocRef = useRef<Y.Doc | null>(null)
  const providerRef = useRef<any>(null)
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    // Create Y.Doc
    const ydoc = createYDoc({ boardId, ...config })
    ydocRef.current = ydoc

    // Attach IndexedDB persistence
    const { provider, synced: syncedPromise } = createIndexedDBProvider(
      boardId,
      ydoc,
    )
    providerRef.current = provider

    syncedPromise.then(() => {
      setSynced(true)
    })

    return () => {
      // Cleanup
      provider.destroy()
      ydoc.destroy()
      setSynced(false)
    }
  }, [boardId]) // Only depend on boardId - config is only used on initial mount

  return {
    ydoc: ydocRef.current,
    synced,
  }
}
