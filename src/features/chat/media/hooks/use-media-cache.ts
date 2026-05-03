/**
 * useMediaCache — IndexDB blob cache for chat media (images + videos).
 *
 * Architecture:
 *   - Cache key: fileId (permanent Vault reference, never expires)
 *   - Value: Blob + mimeType + sizeBytes + cachedAt
 *   - Eviction: LRU by cachedAt when total stored bytes exceed MAX_CACHE_BYTES
 *   - Cross-device: cache is per-browser, no server-side blob persistence
 *
 * Usage:
 *   const { getCached, cacheBlob } = useMediaCache()
 *
 * Cache-first pattern:
 *   1. getCached(fileId) → Blob | null
 *   2. If null → fetch from presigned URL → cacheBlob(fileId, blob, mimeType)
 *   3. URL.createObjectURL(blob) → render → revoke on unmount
 *
 * @layer Features → chat/media/hooks
 */

import { db } from '@/shared/lib/db'

/** 200MB total cache cap — LRU eviction kicks in above this. */
const MAX_CACHE_BYTES = 200 * 1024 * 1024

export interface MediaCacheHook {
  /**
   * Retrieve a cached blob by fileId.
   * Returns null on miss — caller should fetch from network.
   */
  getCached: (fileId: string) => Promise<Blob | null>

  /**
   * Store a blob in the cache.
   * Automatically triggers LRU eviction if total size exceeds MAX_CACHE_BYTES.
   */
  cacheBlob: (fileId: string, blob: Blob, mimeType: string) => Promise<void>
}

export function useMediaCache(): MediaCacheHook {
  const getCached = async (fileId: string): Promise<Blob | null> => {
    try {
      const entry = await db.media_cache.get(fileId)
      if (!entry) return null
      // Defer the LRU touch: only update cachedAt if the entry hasn't been
      // accessed in the last 5 minutes. This prevents a write storm when opening
      // a channel with many cached images (previously fired N writes on mount).
      const TOUCH_INTERVAL_MS = 5 * 60 * 1000
      if (Date.now() - entry.cachedAt > TOUCH_INTERVAL_MS) {
        void db.media_cache.update(fileId, { cachedAt: Date.now() })
      }
      return entry.blob
    } catch {
      return null
    }
  }

  const cacheBlob = async (
    fileId: string,
    blob: Blob,
    mimeType: string,
  ): Promise<void> => {
    try {
      await db.media_cache.put({
        fileId,
        blob,
        mimeType,
        sizeBytes: blob.size,
        cachedAt: Date.now(),
      })
      await evictIfNeeded()
    } catch {
      // Non-fatal — if cache write fails, the blob URL still works for this session
    }
  }

  return { getCached, cacheBlob }
}

/**
 * LRU eviction — runs after each cacheBlob() write.
 * Deletes oldest entries (by cachedAt) until total size is under MAX_CACHE_BYTES.
 */
async function evictIfNeeded(): Promise<void> {
  try {
    // Sum all cached entries by sizeBytes
    let total = 0
    const all = await db.media_cache.orderBy('cachedAt').toArray()
    for (const e of all) total += e.sizeBytes

    if (total <= MAX_CACHE_BYTES) return

    // Evict oldest first until under limit
    for (const entry of all) {
      await db.media_cache.delete(entry.fileId)
      total -= entry.sizeBytes
      if (total <= MAX_CACHE_BYTES) break
    }
  } catch {
    // Non-fatal
  }
}
