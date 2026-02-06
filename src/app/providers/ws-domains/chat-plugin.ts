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

import { createDomainPlugin } from './domain-plugin'
import type { ChatEventHandlerContext } from '@/features/chat/events/model'
import { registerChatHandlers } from '@/features/chat/events'
import { createLogger } from '@/shared/lib/logger'
import { registerPriorityRule } from '@/shared/ws'

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

    registerHandlers() {
      log.debug('Registering chat event handlers')

      // Register chat handlers (new-message, ack-message, sync-required)
      cleanupHandlers = registerChatHandlers(context)

      // Register priority rules for chat message queue
      registerPriorityRule(
        (type) =>
          type === 'chat:send-message' ||
          type === 'chat:send-thread-message' ||
          type === 'chat:edit-message' ||
          type === 'chat:delete-message',
      )

      log.debug('Chat handlers and priority rules registered')
    },

    cleanup() {
      log.debug('Cleaning up chat handlers')
      if (cleanupHandlers) {
        cleanupHandlers()
        cleanupHandlers = null
      }
      // Note: Priority rules are global and not cleaned up per-plugin
      // They should be managed by the domain registry lifecycle
    },
  })
}

// Export event lists for reference
export { UPSTREAM_EVENTS, DOWNSTREAM_EVENTS }
