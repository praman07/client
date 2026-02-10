import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

const selectSessionDomain = (state: RootState) => state.whiteboardSession

export const selectActiveBoardId = createSelector(
  [selectSessionDomain],
  (session) => session.activeBoardId,
)

export const selectConnectionStatus = createSelector(
  [selectSessionDomain],
  (session) => session.connectionStatus,
)

export const selectIsConnected = createSelector(
  [selectSessionDomain],
  (session) => session.connectionStatus === 'connected',
)

export const selectIsOnline = createSelector(
  [selectSessionDomain],
  (session) => session.isOnline,
)

export const selectPendingCount = createSelector(
  [selectSessionDomain],
  (session) => session.pendingUpdateCount,
)

export const selectIsSyncing = createSelector(
  [selectSessionDomain],
  (session) => session.isSyncing,
)

export const selectYDocStatus = createSelector(
  [selectSessionDomain],
  (session) => session.ydocStatus,
)

export const selectSnapshotLoadedAt = createSelector(
  [selectSessionDomain],
  (session) => session.snapshotLoadedAt,
)

export const selectIsReady = createSelector(
  [selectSessionDomain],
  (session) =>
    session.connectionStatus === 'connected' && session.ydocStatus === 'synced',
)
