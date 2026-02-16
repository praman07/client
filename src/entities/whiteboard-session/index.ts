// Model
export { whiteboardSessionSlice } from './model/slice'
export type {
  WhiteboardSessionState,
  ConnectionStatus,
  SyncStatus,
} from './model/types'
export * from './model/selectors'
export * as whiteboardSessionActions from './model/slice'

// Redux Actions (for features/whiteboard-events)
export {
  setConnectionStatus,
  decrementPendingCount,
  incrementPendingCount,
  setActiveBoardId,
} from './model/slice'

// Offline queue
export { offlineQueue } from './lib/offline-queue-manager'

// Lib (⚠️ Only for features/whiteboard-events)
export { uint8ArrayToBase64, base64ToUint8Array } from './lib/encoding'
export { isValidYjsUpdate } from './lib/validation'
export { ydocRegistry } from './lib/ydoc-registry'

// Y.js Integration (V2 Offline-First)
export * from './lib/yjs'
