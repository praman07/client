/**
 * Whiteboard Contracts - Public API
 *
 * @layer Shared
 * @module contracts/whiteboard
 */

// Upstream (Client → Server)
export {
  WhiteboardUpstreamEvent,
  type SubscribeBoardPayload,
  type UnsubscribeBoardPayload,
  type BoardUpdatePayload,
  type CursorMovePayload,
  type SelectionChangePayload,
  type PointerDownPayload,
  type PointerUpPayload,
  type RequestSnapshotPayload,
  type WhiteboardUpstreamPayload,
} from './upstream'

// Downstream (Server → Client)
export {
  WhiteboardDownstreamEvent,
  type BoardCollaborator,
  type BoardInitPayload,
  type BoardUpdatePayload as RemoteBoardUpdatePayload, // Alias to avoid collision
  type UpdateAckPayload,
  type UserJoinedPayload,
  type UserLeftPayload,
  type CursorUpdatePayload,
  type SelectionUpdatePayload,
  type PresenceUpdatePayload,
  type BoardLockedPayload,
  type BoardUnlockedPayload,
  type SnapshotResponsePayload,
  type WhiteboardDownstreamPayload,
} from './downstream'

// Consolidated events
export {
  WhiteboardEvent,
  type WhiteboardEvent as WhiteboardEventType,
} from './events'
