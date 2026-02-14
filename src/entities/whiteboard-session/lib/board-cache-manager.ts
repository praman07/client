import { db } from '@/shared/lib/db'
import * as Y from 'yjs'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:cache')

/**
 * Board Cache Manager - Entity Layer
 *
 * Manages persistent storage of Y.Doc snapshots in IndexedDB for:
 * - Fast cold start (~50ms vs ~500ms from GraphQL)
 * - Offline board viewing
 * - Delta sync with state vectors
 *
 * Architecture:
 * - Debounced saves (5s) to reduce write pressure
 * - Automatic staleness detection (7 days)
 * - Quota monitoring for graceful degradation
 */
class BoardCacheManager {
  private debounceTimers = new Map<string, NodeJS.Timeout>()
  private readonly DEBOUNCE_MS = 5000 // 5 seconds
  private readonly MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days

  /**
   * Load cached snapshot from IndexedDB
   *
   * @param boardId - Board to load cache for
   * @returns Cached snapshot + state vector, or null if cache miss/expired
   *
   * @example
   * const cached = await boardCache.load('board_123')
   * if (cached) {
   *   Y.applyUpdate(ydoc, cached.snapshot, 'snapshot')
   * }
   */
  async load(boardId: string): Promise<{
    snapshot: Uint8Array
    stateVector: Uint8Array
    streamId: string
  } | null> {
    try {
      const cached = await db.whiteboardBoardCache.get(boardId)

      if (!cached) {
        log.debug('Cache miss', { boardId })
        return null
      }

      // Check staleness
      const age = Date.now() - cached.updatedAt
      const ageDays = age / (24 * 60 * 60 * 1000)

      if (age > this.MAX_CACHE_AGE) {
        log.warn('Cache expired', { boardId, ageDays: ageDays.toFixed(1) })
        await db.whiteboardBoardCache.delete(boardId)
        return null
      }

      log.info('Cache hit', {
        boardId,
        size: `${(cached.snapshotSize / 1024).toFixed(1)}KB`,
        age: `${Math.round(age / 1000)}s`,
        ageDays: ageDays.toFixed(1),
      })

      return {
        snapshot: cached.snapshot,
        stateVector: cached.stateVector,
        streamId: cached.streamId,
      }
    } catch (error) {
      log.error('Failed to load cache', { boardId, error })
      return null
    }
  }

  /**
   * Save Y.Doc snapshot to IndexedDB
   *
   * @param boardId - Board to cache
   * @param ydoc - Y.Doc instance to encode
   * @param streamId - Optional last stream ID from server
   * @param immediate - If true, save immediately without debouncing
   *
   * @example
   * // Debounced save (default)
   * await boardCache.save('board_123', ydoc)
   *
   * // Immediate save (on unmount)
   * await boardCache.save('board_123', ydoc, streamId, true)
   */
  async save(
    boardId: string,
    ydoc: Y.Doc,
    streamId?: string,
    immediate = false,
  ): Promise<void> {
    if (!immediate) {
      // Clear existing timer
      const existingTimer = this.debounceTimers.get(boardId)
      if (existingTimer) {
        clearTimeout(existingTimer)
      }

      // Set new debounced save
      const timer = setTimeout(() => {
        this.saveImmediate(boardId, ydoc, streamId)
        this.debounceTimers.delete(boardId)
      }, this.DEBOUNCE_MS)

      this.debounceTimers.set(boardId, timer)
      return
    }

    await this.saveImmediate(boardId, ydoc, streamId)
  }

  private async saveImmediate(
    boardId: string,
    ydoc: Y.Doc,
    streamId?: string,
  ): Promise<void> {
    try {
      // Encode snapshot and state vector
      const snapshot = Y.encodeStateAsUpdate(ydoc)
      const stateVector = Y.encodeStateVector(ydoc)

      // 🛡️ CACHE INTEGRITY VALIDATION
      // Prevent saving empty/corrupted state that would wipe user data

      // Get existing cache for comparison
      const existing = await db.whiteboardBoardCache.get(boardId)

      // Validation 1: Reject suspiciously small snapshots (<100 bytes)
      // Empty Y.Doc = ~10 bytes, minimal content = ~50 bytes
      if (snapshot.byteLength < 100) {
        log.warn('🛡️ Rejecting suspiciously small cache', {
          boardId,
          size: snapshot.byteLength,
          reason: 'Possible empty state corruption',
        })
        return
      }

      // Validation 2: Alert on significant size reduction (>50% shrink)
      // This could indicate accidental data loss
      if (existing && snapshot.byteLength < existing.snapshotSize * 0.5) {
        log.error('🛡️ Cache size reduced by >50% - possible data loss!', {
          boardId,
          oldSize: existing.snapshotSize,
          newSize: snapshot.byteLength,
          reduction: `${((1 - snapshot.byteLength / existing.snapshotSize) * 100).toFixed(1)}%`,
          action: 'Saving anyway but flagged for investigation',
        })
        // Continue saving but log the anomaly for debugging
      }

      await db.whiteboardBoardCache.put({
        boardId,
        snapshot,
        stateVector,
        snapshotSize: snapshot.byteLength,
        streamId: streamId || '0-0',
        updatedAt: Date.now(),
      })

      log.debug('Cache saved', {
        boardId,
        size: `${(snapshot.byteLength / 1024).toFixed(1)}KB`,
        streamId,
      })
    } catch (error) {
      // Check for quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        log.error('IndexedDB quota exceeded', { boardId })
        // TODO: Implement LRU eviction
        return
      }

      log.error('Failed to save cache', { boardId, error })
    }
  }

  /**
   * Get state vector for delta sync
   *
   * @param boardId - Board to get state vector for
   * @returns State vector as Uint8Array, or null if not cached
   *
   * @example
   * const stateVector = await boardCache.getStateVector('board_123')
   * if (stateVector) {
   *   const base64 = uint8ArrayToBase64(stateVector)
   *   // Send to GraphQL for delta sync
   * }
   */
  async getStateVector(boardId: string): Promise<Uint8Array | null> {
    try {
      const cached = await db.whiteboardBoardCache.get(boardId)
      return cached?.stateVector || null
    } catch (error) {
      log.error('Failed to get state vector', { boardId, error })
      return null
    }
  }

  /**
   * Clear cache for a board
   *
   * @param boardId - Board to clear cache for
   *
   * @example
   * await boardCache.clear('board_123')
   */
  async clear(boardId: string): Promise<void> {
    try {
      await db.whiteboardBoardCache.delete(boardId)

      // Clear pending debounce timer
      const timer = this.debounceTimers.get(boardId)
      if (timer) {
        clearTimeout(timer)
        this.debounceTimers.delete(boardId)
      }

      log.info('Cache cleared', { boardId })
    } catch (error) {
      log.error('Failed to clear cache', { boardId, error })
    }
  }

  /**
   * Flush pending saves (called on board unmount)
   *
   * @param boardId - Board to flush
   * @param ydoc - Y.Doc instance
   * @param streamId - Optional last stream ID
   *
   * @example
   * // On board unmount
   * await boardCache.flush('board_123', ydoc, streamId)
   */
  async flush(boardId: string, ydoc: Y.Doc, streamId?: string): Promise<void> {
    // Clear debounce timer if exists
    const timer = this.debounceTimers.get(boardId)
    if (timer) {
      clearTimeout(timer)
      this.debounceTimers.delete(boardId)
    }

    // Save immediately
    await this.saveImmediate(boardId, ydoc, streamId)
    log.debug('Cache flushed on unmount', { boardId })
  }

  /**
   * Check IndexedDB quota usage
   *
   * @returns Quota information
   *
   * @example
   * const quota = await boardCache.checkQuota()
   * if (quota.percentage > 80) {
   *   console.warn('IndexedDB quota pressure')
   * }
   */
  async checkQuota(): Promise<{
    usage: number
    limit: number
    percentage: number
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      const usage = estimate.usage || 0
      const limit = estimate.quota || 0
      const percentage = limit > 0 ? (usage / limit) * 100 : 0

      return { usage, limit, percentage }
    }

    return { usage: 0, limit: Infinity, percentage: 0 }
  }
}

export const boardCache = new BoardCacheManager()
