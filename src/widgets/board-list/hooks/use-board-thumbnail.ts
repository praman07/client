/**
 * useBoardThumbnail
 *
 * Stale-while-revalidate thumbnail loader for board cards.
 *
 * Flow:
 * 1. Show cached WebP from Dexie immediately (if exists)
 * 2. Read current elements from y-indexeddb (read-only, no WS)
 * 3. Hash element id+version pairs — skip regeneration if unchanged
 * 4. Defer generation via requestIdleCallback (never blocks UI)
 * 5. Generate WebP via exportToBlob, persist to Dexie, update display
 *
 * Object URLs are always revoked on unmount to prevent memory leaks.
 */

import { useEffect, useState } from 'react'
import { db } from '@/shared/lib/db'
import { createLogger } from '@/shared/lib/logger'
import {
  generateBoardThumbnail,
  hashElements,
  readBoardElements,
} from '@/shared/lib/thumbnail'

const log = createLogger('thumbnail:hook')

export function useBoardThumbnail(boardId: string): string | null {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    let objectUrl: string | null = null

    async function run() {
      // 1. Show stale cache immediately (stale-while-revalidate)
      const cached = await db.whiteboardThumbnails.get(boardId)
      if (cached) {
        objectUrl = URL.createObjectURL(
          new Blob([cached.thumbnail.buffer as ArrayBuffer], {
            type: 'image/webp',
          }),
        )
        setBlobUrl(objectUrl)
        log.debug('Showing cached thumbnail', {
          boardId,
          sizeBytes: cached.sizeBytes,
        })
      }

      // 2. Read elements from y-indexeddb (read-only, no WS)
      const elements = await readBoardElements(boardId)
      log.debug('Read elements', { boardId, count: elements.length })

      if (elements.length === 0) {
        log.debug('Skipping generation — no elements', { boardId })
        return
      }

      // 3. Skip regeneration if content unchanged
       
      const hash = hashElements(elements as any)
      if (cached?.contentHash === hash) {
        log.debug('Content unchanged, skipping regeneration', { boardId })
        return
      }

      // 4. Yield to idle before generating (staggers across many cards)
      await new Promise<void>((resolve) =>
        requestIdleCallback(() => resolve(), { timeout: 2000 }),
      )

      // 5. Generate WebP thumbnail
      log.debug('Generating thumbnail', {
        boardId,
        elementCount: elements.length,
      })
       
      const webpBytes = await generateBoardThumbnail(elements as any)
      // (generateBoardThumbnail takes a bit of time)

      log.debug('Thumbnail generated', {
        boardId,
        sizeBytes: webpBytes.byteLength,
      })

      // 6. Persist to Dexie
      await db.whiteboardThumbnails.put({
        boardId,
        thumbnail: webpBytes,
        contentHash: hash,
        generatedAt: Date.now(),
        sizeBytes: webpBytes.byteLength,
      })

      // 7. Update display with fresh thumbnail
        setBlobUrl(objectUrl)
    }

    run().catch((err) => {
      log.error('Thumbnail generation failed', { boardId, error: err })
    })

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [boardId])

  return blobUrl
}
