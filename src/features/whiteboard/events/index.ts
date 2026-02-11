/**
 * Whiteboard Events - Public API
 *
 * Exports:
 * - Event handler registration function
 * - Public actions for sending events
 *
 * @layer Features
 * @module whiteboard/events
 */

// Registration function (called in app bootstrap)
export { registerWhiteboardHandlers } from './lib/register-handlers'

// Types (for app bootstrap)
export type { WhiteboardEventHandlerContext } from './model'

// Public actions (used by features/widgets)
// Session management
export { subscribeBoard, unsubscribeBoard } from './api'

// Real-time updates
export { sendBoardUpdate, sendCursorMove, clearCursorThrottle } from './api'
