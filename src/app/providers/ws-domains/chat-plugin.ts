/**
 * CHAT PLUGIN: Domain plugin for chat WebSocket events
 *
 * Responsibility:
 * - Register chat event types with domain registry
 * - Wire up chat event handlers
 * - Bridge between wsManager and chat features
 *
 * Architecture:
 * - Implements DomainPlugin interface
 * - Delegates to existing chat event handlers in features/chat-events
 */
/**
 * CHAT DOMAIN PLUGIN
 * Registers chat-specific event handlers and priority rules.
 */

import type { ChatEventHandlerContext } from '@/features/chat/events'
import { createDomainPlugin } from '@/shared/ws/domains'
import { registerChatHandlers } from '@/features/chat/events'
import {
  ChatDownstreamEvent,
  ChatUpstreamEvent,
} from '@/shared/contracts/chat/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:plugin')

// Chat upstream events (client → server)
const UPSTREAM_EVENTS = Object.values(ChatUpstreamEvent)

// Chat downstream events (server → client)
const DOWNSTREAM_EVENTS = Object.values(ChatDownstreamEvent)

// Chat message priority rules
const PRIORITY_RULES = [
  (type: string) =>
    type === ChatUpstreamEvent.SendMessage ||
    type === ChatUpstreamEvent.SendThreadMessage ||
    type === ChatUpstreamEvent.EditMessage ||
    type === ChatUpstreamEvent.DeleteMessage,
]

let cleanupHandlers: (() => void) | null = null

/**
 * Creates chat plugin with handler context.
 *
 * @param context - Chat event handler dependencies
 */
export function createChatPlugin(context: ChatEventHandlerContext) {
  return createDomainPlugin({
    domain: 'chat',
    upstreamEvents: UPSTREAM_EVENTS,
    downstreamEvents: DOWNSTREAM_EVENTS,
    priorityRules: PRIORITY_RULES,

    registerHandlers() {
      log.debug('Registering chat event handlers')
      cleanupHandlers = registerChatHandlers(context)
      log.debug('Chat handlers registered')
    },

    cleanup() {
      log.debug('Cleaning up chat handlers')
      if (cleanupHandlers) {
        cleanupHandlers()
        cleanupHandlers = null
      }
    },

    onConnect() {
      log.debug('Chat plugin: WebSocket connected')
      // Future: Could trigger re-subscription logic here
    },

    onDisconnect() {
      log.debug('Chat plugin: WebSocket disconnected')
      // Future: Could pause optimistic updates here
    },

    onReconnect() {
      log.debug('Chat plugin: WebSocket reconnected')
      // Future: Could trigger sync check here
    },
  })
}

// Export event lists for reference
export { UPSTREAM_EVENTS, DOWNSTREAM_EVENTS }
