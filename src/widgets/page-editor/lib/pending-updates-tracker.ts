import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:pending-updates-tracker')

const AUTO_CLEANUP_MS = 30_000 // 30 seconds

/**
 * PendingUpdatesTracker — echo prevention for page Yjs updates.
 *
 * Pattern identical to `whiteboard-canvas` PendingUpdatesTracker.
 *
 * How it works:
 *   1. Phase 4 (useNetworkSync) sends a page update to WS
 *   2. Server broadcasts the update back to ALL subscribers (including us)
 *   3. Server also sends page:update-ack with the streamId of our update
 *   4. Phase 4 calls tracker.track(dedupeId) when we send
 *   5. update-ack handler calls tracker.markAcknowledged(streamId, dedupeId)
 *   6. page-update handler calls tracker.has(streamId): if true, skip apply
 *
 * This prevents double-applying our own updates.
 *
 * @layer Widgets
 */
export class PendingUpdatesTracker {
  /** streamId → dedupeId mapping (set on ACK, checked on broadcast) */
  private acknowledgedStreamIds = new Set<string>()
  private cleanupTimers = new Map<string, ReturnType<typeof setTimeout>>()

  /**
   * Called when page:update-ack arrives.
   * Maps the server-assigned streamId so subsequent page:page-update echoes are skipped.
   */
  markAcknowledged(streamId: string): void {
    this.acknowledgedStreamIds.add(streamId)
    log.debug('Update acknowledged', { streamId })

    // Auto-clean after 30 seconds to prevent memory leaks
    const timer = setTimeout(() => {
      this.acknowledgedStreamIds.delete(streamId)
      this.cleanupTimers.delete(streamId)
      log.debug('Tracker entry expired', { streamId })
    }, AUTO_CLEANUP_MS)
    this.cleanupTimers.set(streamId, timer)
  }

  /**
   * Called in page-update handler. If true → skip safeApplyUpdate (it's our own echo).
   */
  has(streamId: string): boolean {
    return this.acknowledgedStreamIds.has(streamId)
  }

  /**
   * Remove a streamId after consuming the echo (optional early eviction).
   */
  remove(streamId: string): void {
    const timer = this.cleanupTimers.get(streamId)
    if (timer) {
      clearTimeout(timer)
      this.cleanupTimers.delete(streamId)
    }
    this.acknowledgedStreamIds.delete(streamId)
  }

  /** Clean up all timers on unmount. */
  destroy(): void {
    this.cleanupTimers.forEach((timer) => clearTimeout(timer))
    this.cleanupTimers.clear()
    this.acknowledgedStreamIds.clear()
    log.debug('PendingUpdatesTracker destroyed')
  }

  get size(): number {
    return this.acknowledgedStreamIds.size
  }
}
