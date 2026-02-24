// Yjs integration utilities for pages offline-first architecture
export { createPageDoc, type PageDocConfig } from './create-ydoc'
export { createPageAwareness, type AwarenessUserInfo } from './create-awareness'
export { PageAwarenessProvider } from './page-awareness-provider'
export {
  createIndexedDBProvider,
  type IndexedDBSyncResult,
} from './indexeddb-provider'
