export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'

export type SyncStatus = 'idle' | 'loading' | 'synced' | 'error'

export interface WhiteboardSessionState {
  activeBoardId: string | null
  connectionStatus: ConnectionStatus
  isOnline: boolean
  lastReconnectAt: number | null
  pendingUpdateCount: number
  isSyncing: boolean
  ydocStatus: SyncStatus
  snapshotLoadedAt: number | null
}
