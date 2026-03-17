import {  createSlice } from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit';
import type {
  ConnectionStatus,
  SyncStatus,
  WhiteboardSessionState,
} from './types'

const initialState: WhiteboardSessionState = {
  activeBoardId: null,
  connectionStatus: 'disconnected',
  isOnline: true,
  lastReconnectAt: null,
  pendingUpdateCount: 0,
  isSyncing: false,
  ydocStatus: 'idle',
  snapshotLoadedAt: null,
}

export const whiteboardSessionSlice = createSlice({
  name: 'whiteboardSession',
  initialState,
  reducers: {
    setActiveBoardId(state, action: PayloadAction<string>) {
      state.activeBoardId = action.payload
    },
    setConnectionStatus(state, action: PayloadAction<ConnectionStatus>) {
      state.connectionStatus = action.payload
      if (action.payload === 'connected') {
        state.lastReconnectAt = Date.now()
      }
    },
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload
    },
    incrementPendingCount(state) {
      state.pendingUpdateCount++
    },
    decrementPendingCount(state, action: PayloadAction<number>) {
      state.pendingUpdateCount = Math.max(
        0,
        state.pendingUpdateCount - action.payload,
      )
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
    resetBoardState(state) {
      state.pendingUpdateCount = 0
      state.isSyncing = false
      state.ydocStatus = 'idle'
      state.snapshotLoadedAt = null
    },
  },
})

export const {
  setActiveBoardId,
  setConnectionStatus,
  setOnlineStatus,
  incrementPendingCount,
  decrementPendingCount,
  setSyncing,
  setYDocStatus,
  resetBoardState,
} = whiteboardSessionSlice.actions

export default whiteboardSessionSlice.reducer
