import { db } from '@/shared/lib/db'
import * as Y from 'yjs'
import { createLogger } from '@/shared/lib/logger'
import { wsManager } from '@/shared/ws/manager'
import { WhiteboardUpstreamEvent } from '@/shared/contracts/whiteboard/upstream'
import { uint8ArrayToBase64 } from '@/entities/whiteboard-session'

const log = createLogger('whiteboard:offline-queue')

/**
 * Offline Queue Manager - Entity Layer
 *
 * Manages queuing of Y.js updates when offline, with reliable flush on reconnect.
 *
 * Architecture:
 * - Enqueue: Store updates to IndexedDB when offline
 * - Flush: Merge with Y.mergeUpdates and send as single update
 * - Cleanup: Remove from queue after ACK received
 * - Quota: Monitor IndexedDB storage pressure
 *
 * Performance:
 * - Debounced flush (500ms) to batch rapid reconnects
 * - Y.mergeUpdates reduces 100 updates → 1 network call
 * - Exponential backoff retry (1s, 2s, 4s, 8s, max 30s)
 *
 * @layer Entity
 */
class OfflineQueueManager {
  private flushTimers = new Map<string, NodeJS.Timeout>()
  private readonly FLUSH_DEBOUNCE_MS = 500
  private readonly MAX_RETRY_DELAY = 30000 // 30s
  private readonly QUOTA_WARNING_THRESHOLD = 0.9 // 90% usage

  /**
   * Enqueue update to IndexedDB (offline path)
   *
   * @param boardId - Board ID
   * @param update - Y.js update binary
   * @param dedupeId - Deduplication ID
   */
  async enqueue(
    boardId: string,
    update: Uint8Array,
    dedupeId: string,
  ): Promise<void> {
    try {
      // Check quota before adding
      await this.checkQuota()

      await db.whiteboardOfflineUpdates.add({
        boardId,
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
        boardId,
        dedupeId,
        size: update.length,
      })
    } catch (error) {
      log.error('Failed to enqueue update', { boardId, dedupeId, error })
      throw error
    }
  }

  /**
   * Flush pending updates for a board (online path)
   *
   * Merges all pending updates with Y.mergeUpdates and sends as single update.
   * Uses debouncing to batch rapid reconnects.
   *
   * @param boardId - Board ID to flush
   */
  async flush(boardId: string): Promise<void> {
    // Debounce to avoid flushing on rapid reconnects
    const existingTimer = this.flushTimers.get(boardId)
    if (existingTimer) clearTimeout(existingTimer)

    const timer = setTimeout(async () => {
      await this.flushImmediate(boardId)
      this.flushTimers.delete(boardId)
    }, this.FLUSH_DEBOUNCE_MS)

    this.flushTimers.set(boardId, timer)
  }

  /**
   * Flush immediately without debouncing
   */
  private async flushImmediate(boardId: string): Promise<void> {
    try {
      // Get all pending updates for this board
      const pending = await db.whiteboardOfflineUpdates
        .where({ boardId, status: 'pending' })
        .sortBy('createdAt')

      if (pending.length === 0) {
        log.debug('No pending updates to flush', { boardId })
        return
      }

      log.info('Flushing offline queue', {
        boardId,
        count: pending.length,
      })

      // Merge all updates into one using Y.mergeUpdates
      const mergedUpdate = Y.mergeUpdates(pending.map((p) => p.update))

      // Generate new dedupeId for the merged update
      const mergedDedupeId = crypto.randomUUID()

      // Mark all as 'sending' with the merged dedupeId
      await db.whiteboardOfflineUpdates
        .where('id')
        .anyOf(pending.map((p) => p.id!))
        .modify({
          status: 'sending',
          mergedInto: mergedDedupeId,
          timestamp: Date.now(),
        })

      // Send merged update
      const encodedUpdate = uint8ArrayToBase64(mergedUpdate)

      wsManager.emit(WhiteboardUpstreamEvent.BoardUpdate, {
        boardId,
        update: encodedUpdate,
        dedupeId: mergedDedupeId,
      })

      log.info('Merged update sent', {
        boardId,
        mergedDedupeId,
        originalCount: pending.length,
        mergedSize: mergedUpdate.length,
        originalSize: pending.reduce((sum, p) => sum + p.update.length, 0),
      })
    } catch (error) {
      log.error('Failed to flush queue', { boardId, error })

      // Reset status to pending for retry
      await db.whiteboardOfflineUpdates
        .where({ boardId, status: 'sending' })
        .modify((item) => {
          item.status = 'pending'
          item.retryCount = item.retryCount + 1
          item.lastRetryAt = Date.now()
        })

      // Schedule retry with exponential backoff
      this.scheduleRetry(boardId)
    }
  }

  /**
   * Schedule retry with exponential backoff
   */
  private scheduleRetry(boardId: string): void {
    // Get max retry count for this board
    db.whiteboardOfflineUpdates
      .where({ boardId, status: 'pending' })
      .toArray()
      .then((pending) => {
        if (pending.length === 0) return

        const maxRetryCount = Math.max(...pending.map((p) => p.retryCount))
        const delay = Math.min(
          1000 * Math.pow(2, maxRetryCount),
          this.MAX_RETRY_DELAY,
        )

        log.warn('Scheduling retry', {
          boardId,
          retryCount: maxRetryCount,
          delayMs: delay,
        })

        setTimeout(() => {
          this.flush(boardId)
        }, delay)
      })
  }

  /**
   * Cleanup queue after ACK received
   *
   * Handles both individual and merged updates.
   *
   * @param dedupeId - Deduplication ID from ACK (could be original or merged)
   * @returns Number of items cleared
   */
  async cleanup(dedupeId: string): Promise<number> {
    // Validate dedupeId is provided
    if (!dedupeId || typeof dedupeId !== 'string') {
      log.warn('Invalid dedupeId provided to cleanup', { dedupeId })
      return 0
    }

    try {
      // Find items with this dedupeId (original) OR mergedInto
      const toDelete = await db.whiteboardOfflineUpdates
        .where('dedupeId')
        .equals(dedupeId)
        .or('mergedInto')
        .equals(dedupeId)
        .toArray()

      if (toDelete.length === 0) {
        log.debug('No queue items to clean', { dedupeId })
        return 0
      }

      // Delete all matching items
      await db.whiteboardOfflineUpdates.bulkDelete(
        toDelete.map((item) => item.id!),
      )

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

  /**
   * Clear all pending updates for a board
   */
  async clear(boardId: string): Promise<void> {
    try {
      const deleted = await db.whiteboardOfflineUpdates
        .where({ boardId })
        .delete()

      log.info('Queue cleared', { boardId, deletedCount: deleted })
    } catch (error) {
      log.error('Failed to clear queue', { boardId, error })
    }
  }

  /**
   * Get pending update count for a board
   */
  async getPendingCount(boardId: string): Promise<number> {
    try {
      return await db.whiteboardOfflineUpdates
        .where({ boardId, status: 'pending' })
        .count()
    } catch (error) {
      log.error('Failed to get pending count', { boardId, error })
      return 0
    }
  }

  /**
   * Check IndexedDB quota and warn if running low
   */
  async checkQuota(): Promise<{
    usage: number
    quota: number
    percentage: number
  }> {
    try {
      const estimate = await navigator.storage.estimate()
      const usage = estimate.usage || 0
      const quota = estimate.quota || 0
      const percentage = quota > 0 ? usage / quota : 0

      if (percentage > this.QUOTA_WARNING_THRESHOLD) {
        log.warn('IndexedDB quota running low', {
          usage: `${(usage / 1024 / 1024).toFixed(1)}MB`,
          quota: `${(quota / 1024 / 1024).toFixed(1)}MB`,
          percentage: `${(percentage * 100).toFixed(1)}%`,
        })

        // TODO: Implement LRU eviction of old queue items
      }

      return { usage, quota, percentage }
    } catch (error) {
      log.error('Failed to check quota', error)
      return { usage: 0, quota: 0, percentage: 0 }
    }
  }
}

export const offlineQueue = new OfflineQueueManager()
