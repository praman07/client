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

// Phase 2: Y.Doc and Tracker registries (for network sync)
export { registerYDoc, unregisterYDoc } from './lib/handlers/board-update'
export { registerTracker, unregisterTracker } from './lib/handlers/update-ack'

// Board deletion callback registry (for board page overlay)
export {
  registerBoardDeletedCallback,
  unregisterBoardDeletedCallback,
} from './lib/handlers/board-deleted'
