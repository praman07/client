/**
 * Pending Updates Tracker
 *
 * Tracks streamIds of updates we've sent to prevent echo when server
 * broadcasts them back to us.
 *
 * Flow:
 * 1. Send update → server generates streamId
 * 2. Receive ACK → add streamId to pending
 * 3. Receive broadcast → check if streamId is pending
 *    - If YES: skip (it's our own update)
 *    - If NO: apply (it's a remote update)
 * 4. Auto-cleanup after 30s timeout
 *
 * @layer Widgets
 * @module whiteboard-canvas/lib
 */

import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:pending-tracker')

/**
 * Tracks pending streamIds to prevent update echo
 */
export class PendingUpdatesTracker {
  private pendingStreamIds = new Set<string>()
  private cleanupTimers = new Map<string, NodeJS.Timeout>()
  private readonly CLEANUP_DELAY = 30000 // 30s - generous for slow networks

  /**
   * Add a streamId to pending set (called when ACK received)
   *
   * Auto-removes after CLEANUP_DELAY to prevent memory leaks
   *
   * @param streamId - Redis stream ID from server ACK
   */
  add(streamId: string) {
    this.pendingStreamIds.add(streamId)

    log.debug('📝 Added pending streamId', {
      streamId,
      total: this.pendingStreamIds.size,
    })

    // Auto-cleanup after delay
    const timer = setTimeout(() => {
      this.remove(streamId)
    }, this.CLEANUP_DELAY)

    this.cleanupTimers.set(streamId, timer)
  }

  /**
   * Check if streamId is in pending set (indicates our own update)
   *
   * @param streamId - Redis stream ID from broadcast
   * @returns true if this is our own update (skip it)
   */
  has(streamId: string): boolean {
    return this.pendingStreamIds.has(streamId)
  }

  /**
   * Remove a streamId from pending set
   *
   * Called after we've seen our own update or on timeout
   *
   * @param streamId - Redis stream ID to remove
   */
  remove(streamId: string) {
    const existed = this.pendingStreamIds.delete(streamId)

    if (existed) {
      log.debug('🗑️  Removed pending streamId', {
        streamId,
        remaining: this.pendingStreamIds.size,
      })
    }

    // Clear timeout timer
    const timer = this.cleanupTimers.get(streamId)
    if (timer) {
      clearTimeout(timer)
      this.cleanupTimers.delete(streamId)
    }
  }

  /**
   * Clear all pending streamIds (cleanup on unmount)
   */
  clear() {
    log.debug('🧹 Clearing all pending streamIds', {
      total: this.pendingStreamIds.size,
    })

    // Clear all timeout timers
    for (const timer of this.cleanupTimers.values()) {
      clearTimeout(timer)
    }

    this.pendingStreamIds.clear()
    this.cleanupTimers.clear()
  }

  /**
   * Get current number of pending streamIds (debugging)
   *
   * @returns Number of streamIds in pending set
   */
  size(): number {
    return this.pendingStreamIds.size
  }
}
