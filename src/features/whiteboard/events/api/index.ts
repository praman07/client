/**
 * Whiteboard Events - Public API
 *
 * Exports public actions for sending WebSocket events
 *
 * @layer Features
 * @module whiteboard/events/api
 */

// Session management
export { subscribeBoard } from './subscribe-board'
export { unsubscribeBoard } from './unsubscribe-board'

// Real-time updates
export { sendBoardUpdate } from './send-board-update'
export { sendCursorMove, clearCursorThrottle } from './send-cursor-move'
