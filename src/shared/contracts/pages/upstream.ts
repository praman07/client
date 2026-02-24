/**
 * Pages Upstream Contracts (Client → Server)
 * Events sent to the backend via WebSocket
 *
 * Types derived from server Zod schemas in each event's schema.ts file.
 *
 * @layer Shared
 */

export enum PageUpstreamEvent {
  Subscribe = 'page:subscribe',
  Unsubscribe = 'page:unsubscribe',
  PageUpdate = 'page:update',
  AwarenessUpdate = 'page:awareness-update',
}

// ─────────────────────────────────────────────────────────────────────────────
// Payload types (match server Zod schema fields exactly)
// ─────────────────────────────────────────────────────────────────────────────

/** Subscribe to a page stream. Use lastStreamId='0-0' on first open. */
export interface SubscribePagePayload {
  pageId: string
  /** Last Redis Stream ID the client processed. '0-0' = first open (no gap-fill). */
  lastStreamId?: string
}

/** Unsubscribe from a page stream (cleanup on unmount). */
export interface UnsubscribePagePayload {
  pageId: string
}

/** Submit a Yjs XmlFragment binary delta. */
export interface PageUpdatePayload {
  pageId: string
  /** base64-encoded Yjs update (Y.encodeStateAsUpdate format) */
  update: string
  /** UUIDv4 — deduplication ID matched in update-ack */
  dedupeId: string
}

/** Submit a y-protocols awareness update (cursor, selection state). */
export interface AwarenessUpdatePayload {
  pageId: string
  /** base64-encoded y-protocols/awareness binary */
  update: string
}
