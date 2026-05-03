/**
 * Whiteboard Event Handlers: Internal exports
 *
 * Architecture: All handlers and their registration wrappers exported for register-handlers.ts
 */

export { handleBoardUpdate, registerBoardUpdateHandler } from './board-update'
export { handleSubscribeSuccess, registerBoardInitHandler } from './subscribe-success'
export { handleUpdateAck, registerUpdateAckHandler } from './update-ack'
export { handleUserJoined, registerUserJoinedHandler } from './user-joined'
export { handleUserLeft, registerUserLeftHandler } from './user-left'
export { handleCursorUpdate, registerCursorUpdateHandler } from './cursor-update'
export { handleBoardLocked, registerBoardLockedHandler } from './board-locked'
export { handleBoardUnlocked, registerBoardUnlockedHandler } from './board-unlocked'
export {
  handleBoardDeleted,
  registerBoardDeletedHandler,
  registerBoardDeletedCallback,
  unregisterBoardDeletedCallback,
} from './board-deleted'
