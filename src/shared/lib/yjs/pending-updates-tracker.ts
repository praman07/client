/**
 * PendingUpdatesTracker
 *
 * Tracks streamIds of Yjs updates we've sent so we can skip applying them
 * when the server broadcasts them back (echo prevention).
 *
 * Flow:
 *   1. Send update → server assigns streamId
 *   2. Receive ACK  → call add() / markAcknowledged()
 *   3. Receive broadcast → call has(streamId); if true, skip apply + call remove()
 *   4. Auto-cleanup after 30s to prevent memory leaks on dropped ACKs
 *
 * @layer Shared
 * @module lib/yjs
 */

import { createLogger } from '@/shared/lib/logger'

const log = createLogger('yjs:pending-updates-tracker')
const DEFAULT_CLEANUP_MS = 30_000

export class PendingUpdatesTracker {
  private pendingStreamIds = new Set<string>()
  private cleanupTimers = new Map<string, ReturnType<typeof setTimeout>>()
  private readonly cleanupDelay: number

  constructor(cleanupDelayMs = DEFAULT_CLEANUP_MS) {
    this.cleanupDelay = cleanupDelayMs
  }

  /**
   * Register a streamId as pending (called when server ACK is received).
   * Auto-removes after cleanupDelay to prevent memory leaks.
   */
  add(streamId: string): void {
    this.pendingStreamIds.add(streamId)
    log.debug('Added pending streamId', { streamId, total: this.pendingStreamIds.size })

    const timer = setTimeout(() => this.remove(streamId), this.cleanupDelay)
    this.cleanupTimers.set(streamId, timer)
  }

  /**
   * Alias for add() — used by the pages domain convention.
   */
  markAcknowledged(streamId: string): void {
    this.add(streamId)
  }

  /**
   * Returns true if this streamId belongs to one of our own updates.
   * If true, the caller should skip applying the broadcast update.
   */
  has(streamId: string): boolean {
    return this.pendingStreamIds.has(streamId)
  }

  /**
   * Remove a streamId (called after consuming the echo or on timeout).
   */
  remove(streamId: string): void {
    this.pendingStreamIds.delete(streamId)
    const timer = this.cleanupTimers.get(streamId)
    if (timer) {
      clearTimeout(timer)
      this.cleanupTimers.delete(streamId)
    }
  }

  /**
   * Clear all pending streamIds and cancel all timers.
   * Call on component unmount.
   */
  clear(): void {
    this.cleanupTimers.forEach((timer) => clearTimeout(timer))
    this.pendingStreamIds.clear()
    this.cleanupTimers.clear()
    log.debug('PendingUpdatesTracker cleared', { cleared: this.pendingStreamIds.size })
  }

  /**
   * Alias for clear() — used by the pages domain convention.
   */
  destroy(): void {
    this.clear()
  }

  /** Current number of tracked streamIds (for debugging). */
  get size(): number {
    return this.pendingStreamIds.size
  }
}
