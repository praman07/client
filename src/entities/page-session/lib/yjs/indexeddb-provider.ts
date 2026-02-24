import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'

export interface IndexedDBSyncResult {
  provider: IndexeddbPersistence
  synced: Promise<void>
}

/**
 * Create IndexedDB persistence provider for a page's Y.Doc
 *
 * Namespaced as 'collabify-page-{pageId}' to avoid collisions with
 * the whiteboard IndexedDB stores ('collabify-board-{boardId}').
 *
 * This provider:
 * - Automatically persists all Y.Doc changes to IndexedDB
 * - Loads existing offline data on initialization (before WS connects)
 * - Syncs across browser tabs via BroadcastChannel
 *
 * @param pageId - Unique page identifier
 * @param ydoc - Y.Doc instance to persist
 * @returns Provider instance and a promise that resolves when IDB is synced
 *
 * @layer Entity
 */
export function createIndexedDBProvider(
  pageId: string,
  ydoc: Y.Doc,
): IndexedDBSyncResult {
  const docName = `collabify-page-${pageId}`
  const provider = new IndexeddbPersistence(docName, ydoc)

  const synced = new Promise<void>((resolve) => {
    provider.on('synced', () => {
      resolve()
    })
  })

  provider.on('error', (error: Error) => {
    console.error(`[Pages:IndexedDB] Error for page ${pageId}:`, error)
  })

  return { provider, synced }
}
