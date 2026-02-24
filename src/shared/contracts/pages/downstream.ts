/**
 * Pages Downstream Contracts (Server → Client)
 * Events received from the backend via WebSocket
 *
 * Types derived from server broadcast payloads in:
 * - subscribe-page/steps/broadcast-join.ts    → page:user-joined
 * - subscribe-page/handler.ts                 → page:subscribe-success
 * - page-update/steps/broadcast.ts            → page:page-update, page:update-ack
 * - unsubscribe-page/steps/broadcast-left.ts  → page:user-left, page:unsubscribe-success
 * - awareness-update/handler.ts               → page:awareness-update (broadcast)
 *
 * @layer Shared
 */

export enum PageDownstreamEvent {
  SubscribeSuccess = 'page:subscribe-success',
  PageUpdate = 'page:page-update',
  UpdateAck = 'page:update-ack',
  UserJoined = 'page:user-joined',
  UserLeft = 'page:user-left',
  UnsubscribeSuccess = 'page:unsubscribe-success',
  /** Awareness re-broadcast from server to other subscribers */
  AwarenessUpdate = 'page:awareness-update',
}

// ─────────────────────────────────────────────────────────────────────────────
// Payload types (match server broadcast frame payloads exactly)
// ─────────────────────────────────────────────────────────────────────────────

/** Collaborator shape inside subscribe-success */
export interface PageCollaboratorInfo {
  userId: string
  fullName: string
  avatarUrl: string | null
}

/**
 * Sent after subscribe-page auth passes.
 * Includes initial lock state — the ONLY way the client learns isLocked
 * (no separate page:locked broadcast event exists on the server).
 */
export interface SubscribeSuccessPayload {
  pageId: string
  isLocked: boolean
  subscriberCount: number
  collaborators: PageCollaboratorInfo[]
}

/** Remote Y.Doc delta from another collaborator. Apply with Y.applyUpdate. */
export interface PageUpdateBroadcastPayload {
  pageId: string
  streamId: string // Redis Stream ID — used for echo prevention
  update: string // base64 Yjs delta
  userId: string
  timestamp: number // unix ms
}

/**
 * ACK for our own update — confirms the update is durably in the Redis stream.
 * Matches dedupeId we sent, lets us clean the offline queue.
 */
export interface UpdateAckPayload {
  dedupeId: string
  status: 'sent' | 'duplicate'
  streamId: string
  pageId: string
}

/** Another user joined the page. */
export interface UserJoinedPayload {
  pageId: string
  userId: string
  fullName: string
  avatarUrl: string | null
  timestamp: number
}

/** Another user left the page. */
export interface UserLeftPayload {
  pageId: string
  userId: string
  timestamp: number
}

/** ACK for our own unsubscribe. */
export interface UnsubscribeSuccessPayload {
  pageId: string
}

/**
 * Awareness update broadcast from server to other subscribers.
 * Apply via PageAwarenessProvider.applyRemoteUpdate().
 */
export interface AwarenessUpdateBroadcastPayload {
  update: string // base64 y-protocols awareness binary
  userId: string
}
