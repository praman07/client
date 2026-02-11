/**
 * Whiteboard Event Handler Registration
 *
 * Architecture: Register all whiteboard event handlers with EventBus
 * Pattern: Matches chat domain registration pattern
 */

import { registerHandler } from '@/shared/ws/event-bus'
import { WhiteboardDownstreamEvent } from '@/shared/contracts/whiteboard/events'
import type {
  BoardInitPayload,
  BoardUpdatePayload,
  UpdateAckPayload,
  UserJoinedPayload,
  UserLeftPayload,
  CursorUpdatePayload,
  BoardLockedPayload,
  BoardUnlockedPayload,
} from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../model'
import {
  handleBoardUpdate,
  handleSubscribeSuccess,
  handleUpdateAck,
  handleUserJoined,
  handleUserLeft,
  handleCursorUpdate,
  handleBoardLocked,
  handleBoardUnlocked,
} from './handlers'

/**
 * Register all whiteboard event handlers
 *
 * @param context - Handler context with dispatch, queryClient, userId
 * @returns Cleanup function to unregister all handlers
 */
export function registerWhiteboardHandlers(
  context: WhiteboardEventHandlerContext,
) {
  const unregisterFns: Array<() => void> = []

  // Board Init (subscribe success)
  unregisterFns.push(
    registerHandler(WhiteboardDownstreamEvent.BoardInit, (event) => {
      handleSubscribeSuccess(event.payload as BoardInitPayload, context)
    }),
  )

  // Board Update (remote CRDT updates)
  unregisterFns.push(
    registerHandler(WhiteboardDownstreamEvent.BoardUpdate, (event) => {
      handleBoardUpdate(event.payload as BoardUpdatePayload, context)
    }),
  )

  // Update ACK (server confirmation)
  unregisterFns.push(
    registerHandler(WhiteboardDownstreamEvent.UpdateAck, (event) => {
      handleUpdateAck(event.payload as UpdateAckPayload, context)
    }),
  )

  // User Joined (new collaborator)
  unregisterFns.push(
    registerHandler(WhiteboardDownstreamEvent.UserJoined, (event) => {
      handleUserJoined(event.payload as UserJoinedPayload, context)
    }),
  )

  // User Left (collaborator disconnected)
  unregisterFns.push(
    registerHandler(WhiteboardDownstreamEvent.UserLeft, (event) => {
      handleUserLeft(event.payload as UserLeftPayload, context)
    }),
  )

  // Cursor Update (remote cursor position)
  unregisterFns.push(
    registerHandler(WhiteboardDownstreamEvent.CursorUpdate, (event) => {
      handleCursorUpdate(event.payload as CursorUpdatePayload, context)
    }),
  )

  // Board Locked (admin action)
  unregisterFns.push(
    registerHandler(WhiteboardDownstreamEvent.BoardLocked, (event) => {
      handleBoardLocked(event.payload as BoardLockedPayload, context)
    }),
  )

  // Board Unlocked (admin action)
  unregisterFns.push(
    registerHandler(WhiteboardDownstreamEvent.BoardUnlocked, (event) => {
      handleBoardUnlocked(event.payload as BoardUnlockedPayload, context)
    }),
  )

  // Return cleanup function
  return () => {
    unregisterFns.forEach((unregister) => unregister())
  }
}
