import * as Y from 'yjs'
import { uint8ArrayToBase64 } from './encoding'
import { db } from '@/shared/lib/db'
import { createLogger } from '@/shared/lib/logger'
import { wsManager } from '@/shared/ws/manager'

const log = createLogger('pages:offline-queue')

// Upstream WS event — matches server contract
const PAGE_UPDATE_EVENT = 'page:page-update'

/**
 * Offline Queue Manager — Pages Domain
 *
 * Manages queuing Yjs updates to IndexedDB when offline, with reliable
 * flush on reconnect. Mirrors whiteboard-session/offline-queue-manager
 * but scoped to pages (uses db.pageOfflineUpdates table and page WS events).
 *
 * Architecture:
 * - Enqueue: Store updates to IndexedDB when offline
 * - Flush: Merge with Y.mergeUpdates and send as single update
 * - Cleanup: Remove from queue after ACK received
 * - Quota: Monitor IndexedDB storage pressure (90% warning threshold)
 *
 * Performance:
 * - Debounced flush (500ms) to batch rapid reconnects
 * - Y.mergeUpdates reduces N updates → 1 network call
 * - Exponential backoff retry (1s, 2s, 4s … max 30s)
 *
 * @layer Entity
 */
class PageOfflineQueueManager {
  private flushTimers = new Map<string, NodeJS.Timeout>()
  private readonly FLUSH_DEBOUNCE_MS = 500
  private readonly MAX_RETRY_DELAY = 30_000
  private readonly QUOTA_WARNING_THRESHOLD = 0.9

  /**
   * Enqueue an update to IndexedDB (offline path)
   */
  async enqueue(
    pageId: string,
    update: Uint8Array,
    dedupeId: string,
  ): Promise<void> {
    try {
      await this.checkQuota()

      await db.pageOfflineUpdates.add({
        pageId,
        update,
        size: update.length,
        dedupeId,
        timestamp: Date.now(),
        status: 'pending',
        retryCount: 0,
        lastRetryAt: null,
        createdAt: Date.now(),
      })

      log.info('Update queued (offline)', {
        pageId,
        dedupeId,
        size: update.length,
      })
    } catch (error) {
      log.error('Failed to enqueue update', { pageId, dedupeId, error })
      throw error
    }
  }

  /**
   * Flush pending updates for a page (online path, with debounce)
   */
  flush(pageId: string): void {
    const existing = this.flushTimers.get(pageId)
    if (existing) clearTimeout(existing)

    const timer = setTimeout(async () => {
      await this.flushImmediate(pageId)
      this.flushTimers.delete(pageId)
    }, this.FLUSH_DEBOUNCE_MS)

    this.flushTimers.set(pageId, timer)
  }

  private async flushImmediate(pageId: string): Promise<void> {
    try {
      const pending = await db.pageOfflineUpdates
        .where({ pageId, status: 'pending' })
        .sortBy('createdAt')

      if (pending.length === 0) {
        log.debug('No pending updates to flush', { pageId })
        return
      }

      log.info('Flushing offline queue', { pageId, count: pending.length })

      const mergedUpdate = Y.mergeUpdates(pending.map((p) => p.update))
      const mergedDedupeId = crypto.randomUUID()

      await db.pageOfflineUpdates
        .where('id')
        .anyOf(pending.map((p) => p.id!))
        .modify({
          status: 'sending',
          mergedInto: mergedDedupeId,
          timestamp: Date.now(),
        })

      wsManager.emit(PAGE_UPDATE_EVENT, {
        pageId,
        update: uint8ArrayToBase64(mergedUpdate),
        dedupeId: mergedDedupeId,
      })

      log.info('Merged update sent', {
        pageId,
        mergedDedupeId,
        originalCount: pending.length,
        mergedSize: mergedUpdate.length,
      })
    } catch (error) {
      log.error('Failed to flush queue', { pageId, error })

      await db.pageOfflineUpdates
        .where({ pageId, status: 'sending' })
        .modify((item) => {
          item.status = 'pending'
          item.retryCount = item.retryCount + 1
          item.lastRetryAt = Date.now()
        })

      this.scheduleRetry(pageId)
    }
  }

  private scheduleRetry(pageId: string): void {
    db.pageOfflineUpdates
      .where({ pageId, status: 'pending' })
      .toArray()
      .then((pending) => {
        if (pending.length === 0) return
        const maxRetry = Math.max(...pending.map((p) => p.retryCount))
        const delay = Math.min(
          1000 * Math.pow(2, maxRetry),
          this.MAX_RETRY_DELAY,
        )
        log.warn('Scheduling retry', {
          pageId,
          retryCount: maxRetry,
          delayMs: delay,
        })
        setTimeout(() => this.flush(pageId), delay)
      })
  }

  /**
   * Cleanup queue items after ACK received.
   * Handles both individual and merged dedupeIds.
   */
  async cleanup(dedupeId: string): Promise<number> {
    if (!dedupeId || typeof dedupeId !== 'string') {
      log.warn('Invalid dedupeId provided to cleanup', { dedupeId })
      return 0
    }
    try {
      const toDelete = await db.pageOfflineUpdates
        .where('dedupeId')
        .equals(dedupeId)
        .or('mergedInto')
        .equals(dedupeId)
        .toArray()

      if (toDelete.length === 0) return 0

      await db.pageOfflineUpdates.bulkDelete(toDelete.map((i) => i.id!))
      log.info('Queue cleaned after ACK', {
        dedupeId,
        clearedCount: toDelete.length,
      })
      return toDelete.length
    } catch (error) {
      log.error('Failed to cleanup queue', { dedupeId, error })
      return 0
    }
  }

  async clear(pageId: string): Promise<void> {
    const deleted = await db.pageOfflineUpdates.where({ pageId }).delete()
    log.info('Queue cleared', { pageId, deletedCount: deleted })
  }

  async getPendingCount(pageId: string): Promise<number> {
    return db.pageOfflineUpdates.where({ pageId, status: 'pending' }).count()
  }

  async checkQuota(): Promise<void> {
    try {
      const estimate = await navigator.storage.estimate()
      const usage = estimate.usage ?? 0
      const quota = estimate.quota ?? 0
      const pct = quota > 0 ? usage / quota : 0
      if (pct > this.QUOTA_WARNING_THRESHOLD) {
        log.warn('IndexedDB quota running low', {
          usage: `${(usage / 1024 / 1024).toFixed(1)}MB`,
          quota: `${(quota / 1024 / 1024).toFixed(1)}MB`,
          percentage: `${(pct * 100).toFixed(1)}%`,
        })
      }
    } catch {
      // Non-fatal — quota check is best-effort
    }
  }
}

export const pageOfflineQueue = new PageOfflineQueueManager()
