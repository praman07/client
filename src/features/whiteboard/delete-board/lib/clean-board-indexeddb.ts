/**
 * Clean Board from IndexedDB
 *
 * y-indexeddb uses boardId as the database name.
 * Deletes the entire database for the board on deletion.
 * Non-throwing — failures are logged only (non-critical).
 */

import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:indexeddb-cleanup')

export async function cleanBoardFromIndexedDB(boardId: string): Promise<void> {
  return new Promise((resolve) => {
    let request: IDBOpenDBRequest

    try {
      request = indexedDB.deleteDatabase(boardId)
    } catch (err) {
      log.error('IndexedDB deleteDatabase threw', { boardId, err })
      resolve()
      return
    }

    request.onsuccess = () => {
      log.info('IndexedDB cleaned', { boardId })
      resolve()
    }

    request.onerror = () => {
      log.error('IndexedDB cleanup failed', { boardId, error: request.error })
      resolve() // non-fatal
    }

    request.onblocked = () => {
      // Another tab has the DB open — it will be deleted when that tab closes
      log.warn('IndexedDB cleanup blocked (connection open elsewhere)', {
        boardId,
      })
      resolve() // non-fatal
    }
  })
}
