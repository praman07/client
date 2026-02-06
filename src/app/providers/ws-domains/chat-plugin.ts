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

import type { ChatEventHandlerContext } from '@/features/chat/events/model'
import { createDomainPlugin } from '@/shared/ws/domains'
import { registerChatHandlers } from '@/features/chat/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:plugin')

// Chat upstream events (client → server)
const UPSTREAM_EVENTS = [
  'chat:ping',
  'chat:subscribe-conversation',
  'chat:unsubscribe-conversation',
  'chat:send-message',
  'chat:send-thread-message',
  'chat:edit-message',
  'chat:delete-message',
  'chat:typing-start',
  'chat:typing-stop',
]

// Chat downstream events (server → client)
const DOWNSTREAM_EVENTS = [
  'chat:pong',
  'chat:subscribe-ack',
  'chat:new-message',
  'chat:new-thread-message',
  'chat:message-edited',
  'chat:message-deleted',
  'chat:ack-message',
  'chat:sync-required',
  'chat:user-typing',
]

// Chat message priority rules
const PRIORITY_RULES = [
  (type: string) =>
    type === 'chat:send-message' ||
    type === 'chat:send-thread-message' ||
    type === 'chat:edit-message' ||
    type === 'chat:delete-message',
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
