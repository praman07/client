/**
 * Whiteboard Event Handlers: Internal exports
 *
 * Architecture: All handlers exported for registration module
 */

export { handleBoardUpdate } from './board-update'
export { handleSubscribeSuccess } from './subscribe-success'
export { handleUpdateAck } from './update-ack'
export { handleUserJoined } from './user-joined'
export { handleUserLeft } from './user-left'
export { handleCursorUpdate } from './cursor-update'
export { handleBoardLocked } from './board-locked'
export { handleBoardUnlocked } from './board-unlocked'
export {
  handleBoardDeleted,
  registerBoardDeletedCallback,
  unregisterBoardDeletedCallback,
} from './board-deleted'
