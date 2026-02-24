export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'locked' // Page has been locked by admin — editor becomes read-only

export type SyncStatus = 'idle' | 'loading' | 'synced' | 'error'

export interface PageSessionState {
  activePageId: string | null
  connectionStatus: ConnectionStatus
  isOnline: boolean
  /** True when server sent page:page-locked → Tiptap editor editable: false */
  isLocked: boolean
  lastReconnectAt: number | null
  pendingUpdateCount: number
  isSyncing: boolean
  ydocStatus: SyncStatus
  snapshotLoadedAt: number | null
}
