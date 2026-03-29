/**
 * REGISTER HANDLERS: Chat event handler registration logic
 *
 * Responsibility:
 * - Register all chat event handlers with event router
 * - Wire up handler context dependencies
 * - Return cleanup function for unmounting
 */

import {
  registerAckMessageHandler,
  registerDeleteMessageHandler,
  registerEditMessageHandler,
  registerNewMessageHandler,
  registerReactionHandlers,
  registerSyncRequiredHandler,
} from './handlers'
import { startOutboxRetryWorker } from './outbox-worker'
import type { ChatEventHandlerContext } from '../model'

/**
 * Registers all chat event handlers.
 *
 * @param context - Handler dependencies (getProjectId, etc.)
 * @returns Cleanup function to unregister handlers
 */
export function registerChatHandlers(context: ChatEventHandlerContext) {
  // Start the background worker
  const stopWorker = startOutboxRetryWorker()

  const unsubs = [
    registerNewMessageHandler(context),
    registerAckMessageHandler(context),
    registerSyncRequiredHandler(context),
    registerEditMessageHandler(),
    registerDeleteMessageHandler(),
    registerReactionHandlers(() => context.getCurrentUserId()),
  ]

  return () => {
    stopWorker() // Stop the interval
    unsubs.forEach((u) => u()) // Unsubscribe listeners
  }
}
