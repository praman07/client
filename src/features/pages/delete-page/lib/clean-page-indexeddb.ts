/**
 * Clean Page from IndexedDB
 *
 * Pages use two IndexedDB stores that must be cleaned on deletion:
 *   1. Dexie offline queue  — pageOfflineUpdates table (from page-session entity)
 *   2. Y.Doc IDB store      — y-indexeddb stores the Y.Doc keyed by pageId
 *
 * Non-throwing — all failures are logged only (non-critical cleanup).
 *
 * @layer Features
 */

import { pageOfflineQueue } from '@/entities/page-session'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:indexeddb-cleanup')

export async function cleanPageFromIndexedDB(pageId: string): Promise<void> {
  // a) Clear offline queue entries for this page (Dexie)
  try {
    await pageOfflineQueue.clear(pageId)
    log.debug('Offline queue cleared', { pageId })
  } catch (err) {
    log.error('Failed to clear offline queue', { pageId, err })
  }

  // b) Delete y-indexeddb store (Y.Doc persistence keyed by pageId)
  return new Promise((resolve) => {
    let request: IDBOpenDBRequest

    try {
      request = indexedDB.deleteDatabase(pageId)
    } catch (err) {
      log.error('indexedDB.deleteDatabase threw', { pageId, err })
      resolve()
      return
    }

    request.onsuccess = () => {
      log.info('Y.Doc IDB store cleaned', { pageId })
      resolve()
    }

    request.onerror = () => {
      log.error('Y.Doc IDB cleanup failed', { pageId, error: request.error })
      resolve() // non-fatal
    }

    request.onblocked = () => {
      // Another tab has the DB open — will be deleted when that tab closes
      log.warn('Y.Doc IDB cleanup blocked (connection open elsewhere)', {
        pageId,
      })
      resolve() // non-fatal
    }
  })
}
