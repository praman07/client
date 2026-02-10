// Model
export { whiteboardSessionSlice } from './model/slice'
export type {
  WhiteboardSessionState,
  ConnectionStatus,
  SyncStatus,
} from './model/types'
export * from './model/selectors'
export * as whiteboardSessionActions from './model/slice'

// Hooks
export { useYDocInstance } from './hooks/use-ydoc-instance'
export { useSyncStatus } from './hooks/use-sync-status'

// Lib (⚠️ Only for features/whiteboard-events)
export { applyRemoteUpdate } from './lib/ydoc-manager'
export { base64ToUint8Array, uint8ArrayToBase64 } from './lib/encoding'
export { isValidYjsUpdate } from './lib/validation'
