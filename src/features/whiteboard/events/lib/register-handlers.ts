/**
 * Whiteboard Event Handler Registration
 *
 * Architecture: Register all whiteboard event handlers with EventBus.
 * Each event uses a named registerXHandler() from its handler file,
 * matching the chat domain registration pattern for testability.
 */

import {
  registerBoardDeletedHandler,
  registerBoardInitHandler,
  registerBoardLockedHandler,
  registerBoardUnlockedHandler,
  registerBoardUpdateHandler,
  registerCursorUpdateHandler,
  registerUpdateAckHandler,
  registerUserJoinedHandler,
  registerUserLeftHandler,
} from './handlers'
import type { WhiteboardEventHandlerContext } from '../model'

/**
 * Register all whiteboard event handlers.
 *
 * @param context - Handler context with dispatch, queryClient, userId
 * @returns Cleanup function to unregister all handlers
 */
export function registerWhiteboardHandlers(
  context: WhiteboardEventHandlerContext,
) {
  const cleanups = [
    registerBoardInitHandler(context),    // whiteboard:board-init
    registerBoardUpdateHandler(context),  // whiteboard:board-update (CRDT)
    registerUpdateAckHandler(context),    // whiteboard:update-ack (echo prevention)
    registerUserJoinedHandler(context),   // whiteboard:user-joined (presence)
    registerUserLeftHandler(context),     // whiteboard:user-left (presence)
    registerCursorUpdateHandler(context), // whiteboard:cursor-update (real-time cursors)
    registerBoardLockedHandler(context),  // whiteboard:board-locked
    registerBoardUnlockedHandler(context),// whiteboard:board-unlocked
    registerBoardDeletedHandler(context), // whiteboard:board-deleted
  ]

  return () => cleanups.forEach((fn) => fn())
}
