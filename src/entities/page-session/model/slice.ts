import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PageSessionState, ConnectionStatus, SyncStatus } from './types'

const initialState: PageSessionState = {
  activePageId: null,
  connectionStatus: 'disconnected',
  isOnline: true,
  isLocked: false,
  lastReconnectAt: null,
  pendingUpdateCount: 0,
  isSyncing: false,
  ydocStatus: 'idle',
  snapshotLoadedAt: null,
}

/**
 * Redux slice for page session state
 *
 * Tracks the lifecycle of a single collaborative page editing session.
 * Consumed by:
 * - features/pages/events handlers → setConnectionStatus, setPageLocked
 * - widgets/page-editor → read isLocked to set Tiptap editable prop
 *
 * @layer Entity
 */
export const pageSessionSlice = createSlice({
  name: 'pageSession',
  initialState,
  reducers: {
    setActivePageId(state, action: PayloadAction<string | null>) {
      state.activePageId = action.payload
    },

    setConnectionStatus(state, action: PayloadAction<ConnectionStatus>) {
      state.connectionStatus = action.payload
      if (action.payload === 'reconnecting') {
        state.lastReconnectAt = Date.now()
      }
    },

    setPageLocked(state, action: PayloadAction<boolean>) {
      state.isLocked = action.payload
      // Sync connectionStatus so the rest of the UI can gate on one field
      state.connectionStatus = action.payload ? 'locked' : 'connected'
    },

    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload
    },

    setSyncing(state, action: PayloadAction<boolean>) {
      state.isSyncing = action.payload
    },

    setYDocStatus(state, action: PayloadAction<SyncStatus>) {
      state.ydocStatus = action.payload
      if (action.payload === 'synced') {
        state.snapshotLoadedAt = Date.now()
      }
    },

    resetPageState() {
      return initialState
    },
  },
})

export const {
  setActivePageId,
  setConnectionStatus,
  setPageLocked,
  setOnlineStatus,
  setSyncing,
  setYDocStatus,
  resetPageState,
} = pageSessionSlice.actions

export default pageSessionSlice.reducer
