/**
 * Register all page WS event handlers with the event bus.
 * Returns a cleanup function — called when the WS domain plugin is destroyed.
 *
 * Architecture: Each event uses a named registerXHandler() from its handler file,
 * matching the chat and whiteboard domain registration pattern.
 *
 * @layer Features
 */

import {
  registerPageAwarenessUpdateHandler,
  registerPageSubscribeSuccessHandler,
  registerPageUpdateAckHandler,
  registerPageUpdateHandler,
  registerPageUserJoinedHandler,
  registerPageUserLeftHandler,
} from './handlers'
import type { PageEventHandlerContext } from '../model'

/**
 * Registers all page event handlers.
 *
 * @param context - Handler dependencies (dispatch, queryClient, userId)
 * @returns Cleanup function to unregister all handlers
 */
export function registerPageHandlers(
  context: PageEventHandlerContext,
): () => void {
  const cleanups = [
    registerPageSubscribeSuccessHandler(context), // page:subscribe-success
    registerPageUpdateHandler(context),           // page:page-update (CRDT)
    registerPageUpdateAckHandler(context),        // page:update-ack (echo prevention)
    registerPageUserJoinedHandler(context),       // page:user-joined (presence)
    registerPageUserLeftHandler(context),         // page:user-left (presence)
    registerPageAwarenessUpdateHandler(context),  // page:awareness-update (cursors)
  ]

  return () => cleanups.forEach((fn) => fn())
}
