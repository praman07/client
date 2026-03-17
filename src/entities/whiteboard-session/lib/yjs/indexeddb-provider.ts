import { IndexeddbPersistence } from 'y-indexeddb'
import type * as Y from 'yjs'

export interface IndexedDBSyncResult {
  provider: IndexeddbPersistence
  synced: Promise<void>
}

/**
 * Create IndexedDB persistence provider for Y.Doc
 *
 * This provider:
 * - Automatically persists all Y.Doc changes to IndexedDB
 * - Loads existing data on initialization
 * - Syncs across browser tabs via BroadcastChannel
 *
 * @param boardId - Unique board identifier
 * @param ydoc - Y.Doc instance to persist
 * @returns Provider instance and synced promise
 */
export function createIndexedDBProvider(
  boardId: string,
  ydoc: Y.Doc,
): IndexedDBSyncResult {
  const docName = `collabify-board-${boardId}`
  const provider = new IndexeddbPersistence(docName, ydoc)

  const synced = new Promise<void>((resolve) => {
    provider.on('synced', () => {
      console.log(`[IndexedDB] Synced board: ${boardId}`)
      resolve()
    })
  })

  // Log errors
  provider.on('error', (error: Error) => {
    console.error(`[IndexedDB] Error for board ${boardId}:`, error)
  })

  return { provider, synced }
}
