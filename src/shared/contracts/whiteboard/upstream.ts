/**
 * Whiteboard Upstream Contracts (Client → Server)
 * Events sent from frontend to backend via WebSocket
 *
 * @layer Shared
 * @module contracts/whiteboard
 */

// ============================================================================
// UPSTREAM EVENT NAMES
// ============================================================================

export enum WhiteboardUpstreamEvent {
  Subscribe = 'whiteboard:subscribe-board',
  Unsubscribe = 'whiteboard:unsubscribe-board',
  BoardUpdate = 'whiteboard:board-update',
  CursorMove = 'whiteboard:cursor-move',
  SelectionChange = 'whiteboard:selection-change',
  PointerDown = 'whiteboard:pointer-down',
  PointerUp = 'whiteboard:pointer-up',
  RequestSnapshot = 'whiteboard:request-snapshot',
}

// ============================================================================
// UPSTREAM PAYLOADS
// ============================================================================

/**
 * Subscribe to a board session
 * Triggers backend to send board-init with snapshot
 */
export interface SubscribeBoardPayload {
  boardId: string
}

/**
 * Unsubscribe from a board session
 * Cleanup presence, stop receiving updates
 */
export interface UnsubscribeBoardPayload {
  boardId: string
}

/**
 * Send Y.js update to server
 * Will be appended to Redis Stream and broadcast to all collaborators
 */
export interface BoardUpdatePayload {
  boardId: string
  update: string // Base64-encoded Uint8Array (Y.js binary update)
  dedupeId: string // UUID v4 for idempotency
}

/**
 * Send cursor position (ephemeral, not persisted)
 * Throttled to ~60fps in implementation
 */
export interface CursorMovePayload {
  boardId: string
  x: number
  y: number
}

/**
 * Send selection change (which elements are selected)
 * Used for collaborative selection highlights
 */
export interface SelectionChangePayload {
  boardId: string
  elementIds: string[] // Array of Excalidraw element IDs
}

/**
 * Pointer down event (drawing started)
 * Used to show "User is drawing..." indicator
 */
export interface PointerDownPayload {
  boardId: string
}

/**
 * Pointer up event (drawing ended)
 * Clears "User is drawing..." indicator
 */
export interface PointerUpPayload {
  boardId: string
}

/**
 * Request Y.Doc snapshot (recovery mechanism)
 * Used when client detects missing updates
 */
export interface RequestSnapshotPayload {
  boardId: string
  fromStreamId?: string // Optional: Last known stream ID for delta computation
}

// ============================================================================
// DISCRIMINATED UNION
// ============================================================================

/**
 * Type-safe union of all upstream payloads
 * Use with discriminated union pattern in event handlers
 */
export type WhiteboardUpstreamPayload =
  | SubscribeBoardPayload
  | UnsubscribeBoardPayload
  | BoardUpdatePayload
  | CursorMovePayload
  | SelectionChangePayload
  | PointerDownPayload
  | PointerUpPayload
  | RequestSnapshotPayload
