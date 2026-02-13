/**
 * Whiteboard Downstream Contracts (Server → Client)
 * Events received from backend via WebSocket
 *
 * @layer Shared
 * @module contracts/whiteboard
 */

// ============================================================================
// DOWNSTREAM EVENT NAMES
// ============================================================================

export enum WhiteboardDownstreamEvent {
  BoardInit = 'whiteboard:subscribe-success', // Server sends this on successful subscribe
  BoardUpdate = 'whiteboard:board-update',
  UpdateAck = 'whiteboard:update-ack',
  UserJoined = 'whiteboard:user-joined',
  UserLeft = 'whiteboard:user-left',
  CursorUpdate = 'whiteboard:cursor-update',
  SelectionUpdate = 'whiteboard:selection-update',
  PresenceUpdate = 'whiteboard:presence-update',
  BoardLocked = 'whiteboard:board-locked',
  BoardUnlocked = 'whiteboard:board-unlocked',
  SnapshotResponse = 'whiteboard:snapshot-response',
}

// ============================================================================
// DOWNSTREAM PAYLOADS
// ============================================================================

/**
 * Collaborator info in board-init event
 */
export interface BoardCollaborator {
  userId: string
  fullName: string
  avatarUrl: string | null
}

/**
 * Board initial state (sent on subscribe success)
 * Contains full Y.Doc snapshot and metadata
 */
export interface BoardInitPayload {
  boardId: string
  snapshot: string // Base64-encoded Y.Doc state
  streamId: string // Current Redis stream ID for delta syncing
  elementCount: number // Performance hint
  collaborators: BoardCollaborator[]
}

/**
 * Remote board update (from another collaborator)
 * Apply this update to local Y.Doc
 */
export interface BoardUpdatePayload {
  boardId: string
  streamId: string // Redis stream ID for ordering
  update: string // Base64-encoded Y.js update
  authorId: string
  sequence: number // Monotonic sequence number for gap detection
  timestamp: string // ISO 8601 datetime
}

/**
 * ACK for sent update (confirms server received it)
 * Use dedupeId to match with local queue
 */
export interface UpdateAckPayload {
  dedupeId: string // Matches client's sent dedupeId
  streamId: string // Redis stream ID (durable)
  timestamp: string // ISO 8601 datetime
}

/**
 * User joined board
 */
export interface UserJoinedPayload {
  boardId: string
  userId: string
  fullName: string
  avatarUrl: string | null
  timestamp: string // ISO 8601 datetime
}

/**
 * User left board
 */
export interface UserLeftPayload {
  boardId: string
  userId: string
  timestamp: string // ISO 8601 datetime
}

/**
 * Cursor position update (ephemeral)
 * Render remote cursor at this position
 */
export interface CursorUpdatePayload {
  boardId: string
  userId: string
  x: number
  y: number
  timestamp: string // ISO 8601 datetime
}

/**
 * Selection update (ephemeral)
 * Highlight selected elements for this user
 */
export interface SelectionUpdatePayload {
  boardId: string
  userId: string
  elementIds: string[]
  timestamp: string // ISO 8601 datetime
}

/**
 * Presence update (drawing state)
 * Show "User is drawing..." indicator
 */
export interface PresenceUpdatePayload {
  boardId: string
  userId: string
  isDrawing: boolean
  timestamp: string // ISO 8601 datetime
}

/**
 * Board locked (admin action)
 * Disable editing for non-admins
 */
export interface BoardLockedPayload {
  boardId: string
  lockedBy: string
  timestamp: string // ISO 8601 datetime
}

/**
 * Board unlocked (admin action)
 * Re-enable editing
 */
export interface BoardUnlockedPayload {
  boardId: string
  unlockedBy: string
  timestamp: string // ISO 8601 datetime
}

/**
 * Snapshot response (recovery mechanism)
 * Full Y.Doc state for recovery after gap detection
 */
export interface SnapshotResponsePayload {
  boardId: string
  snapshot: string // Base64-encoded Y.Doc state
  streamId: string // Current Redis stream ID
  elementCount: number // Performance hint
}

// ============================================================================
// DISCRIMINATED UNION
// ============================================================================

/**
 * Type-safe union of all downstream payloads
 * Use with discriminated union pattern in event handlers
 */
export type WhiteboardDownstreamPayload =
  | BoardInitPayload
  | BoardUpdatePayload
  | UpdateAckPayload
  | UserJoinedPayload
  | UserLeftPayload
  | CursorUpdatePayload
  | SelectionUpdatePayload
  | PresenceUpdatePayload
  | BoardLockedPayload
  | BoardUnlockedPayload
  | SnapshotResponsePayload
