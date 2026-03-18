/**
 * WHITEBOARD PLUGIN: Domain plugin for whiteboard WebSocket events
 *
 * Responsibility:
 * - Register whiteboard event types with domain registry
 * - Wire up whiteboard event handlers
 * - Bridge between wsManager and whiteboard features
 *
 * Architecture:
 * - Implements DomainPlugin interface
 * - Delegates to existing whiteboard event handlers in features/whiteboard/events
 */

import type { WhiteboardEventHandlerContext } from '@/features/whiteboard/events'
import { createDomainPlugin } from '@/shared/ws/domains'
import { registerWhiteboardHandlers } from '@/features/whiteboard/events'
import {
  WhiteboardDownstreamEvent,
  WhiteboardUpstreamEvent,
} from '@/shared/contracts/whiteboard/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:whiteboard-plugin')

// Whiteboard upstream events (client → server)
const UPSTREAM_EVENTS = Object.values(WhiteboardUpstreamEvent)

// Whiteboard downstream events (server → client)
const DOWNSTREAM_EVENTS = Object.values(WhiteboardDownstreamEvent)

// Whiteboard priority rules
// Board updates are high priority for smooth real-time collaboration
const PRIORITY_RULES = [
  (type: string) =>
    type === WhiteboardUpstreamEvent.BoardUpdate ||
    type === WhiteboardUpstreamEvent.CursorMove,
]

let cleanupHandlers: (() => void) | null = null

/**
 * Creates whiteboard plugin with handler context.
 *
 * @param context - Whiteboard event handler dependencies
 */
export function createWhiteboardPlugin(context: WhiteboardEventHandlerContext) {
  return createDomainPlugin({
    domain: 'whiteboard',
    upstreamEvents: UPSTREAM_EVENTS,
    downstreamEvents: DOWNSTREAM_EVENTS,
    priorityRules: PRIORITY_RULES,

    registerHandlers() {
      log.debug('Registering whiteboard event handlers')
      cleanupHandlers = registerWhiteboardHandlers(context)
      log.debug('Whiteboard handlers registered')
    },

    cleanup() {
      log.debug('Cleaning up whiteboard handlers')
      if (cleanupHandlers) {
        cleanupHandlers()
        cleanupHandlers = null
      }
    },

    onConnect() {
      log.debug('Whiteboard plugin: WebSocket connected')
      // Future: Could trigger re-subscription to active boards
    },

    onDisconnect() {
      log.debug('Whiteboard plugin: WebSocket disconnected')
      // Future: Could pause Y.Doc updates
    },

    onReconnect() {
      log.debug('Whiteboard plugin: WebSocket reconnected')
      // Future: Could trigger state vector sync
    },
  })
}

// Export event lists for reference
export { UPSTREAM_EVENTS, DOWNSTREAM_EVENTS }
