// ============================================================================
// Public API — page-session entity
// Only export what is actually consumed by features and widgets.
// ============================================================================

// Encoding (consumed by: features/pages/*, widgets/page-editor/*)
export { uint8ArrayToBase64, base64ToUint8Array } from './lib/encoding'

// Y.Doc factory (consumed by: widgets/page-editor/hooks/use-page-sync.ts)
export { createPageDoc, type PageDocConfig } from './lib/yjs/create-ydoc'

// Tiptap awareness provider (consumed by: widgets/page-editor/hooks/sync-phases/use-tiptap-binding.ts)
export { PageAwarenessProvider } from './lib/yjs/page-awareness-provider'

// IndexedDB provider factory (consumed by: widgets/page-editor/hooks/sync-phases/use-indexeddb-sync.ts)
export {
  createIndexedDBProvider,
  type IndexedDBSyncResult,
} from './lib/yjs/indexeddb-provider'

// Offline queue (consumed by: features/pages/events/api/send-page-update.ts + subscribe-success handler)
export { pageOfflineQueue } from './lib/offline-queue-manager'

// Redux model (consumed by: features/pages/events/handlers/page-locked.ts, page-unlocked.ts)
export {
  pageSessionSlice,
  setConnectionStatus,
  setPageLocked,
} from './model/slice'
export type {
  PageSessionState,
  ConnectionStatus,
  SyncStatus,
} from './model/types'
