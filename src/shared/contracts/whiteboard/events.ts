/**
 * Whiteboard Event Consolidation
 * Combines upstream and downstream events into single namespace
 *
 * @layer Shared
 * @module contracts/whiteboard
 */

import { WhiteboardUpstreamEvent } from './upstream'
import { WhiteboardDownstreamEvent } from './downstream'

/**
 * All whiteboard WebSocket events (bidirectional)
 * Combines upstream (client→server) and downstream (server→client) events
 */
export const WhiteboardEvent = {
  ...WhiteboardUpstreamEvent,
  ...WhiteboardDownstreamEvent,
} as const

/**
 * Type-safe union of all whiteboard event names
 */
export type WhiteboardEvent =
  | WhiteboardUpstreamEvent
  | WhiteboardDownstreamEvent
