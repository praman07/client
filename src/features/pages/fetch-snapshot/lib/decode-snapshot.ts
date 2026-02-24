import { base64ToUint8Array } from '@/entities/page-session'

export interface DecodedPageSnapshot {
  pageId: string
  diff: Uint8Array // decoded Y.Doc update — apply with Y.applyUpdate
  lastStreamId: string // pass to subscribePage() for gap-fill
  snapshotTimestamp: string | null
}

/**
 * Decode the raw GQL response into a usable snapshot.
 *
 * Note: PageSnapshot has no pageId field on the server return type —
 * we thread the pageId through from the hook's call context.
 */
export function decodePageSnapshot(
  pageId: string,
  raw: {
    snapshot: string
    lastStreamId: string
    snapshotTimestamp?: string | null
  },
): DecodedPageSnapshot {
  return {
    pageId,
    diff: base64ToUint8Array(raw.snapshot),
    lastStreamId: raw.lastStreamId,
    snapshotTimestamp: raw.snapshotTimestamp ?? null,
  }
}
