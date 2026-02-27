import type { RootState } from '@/app/store/config'

/**
 * Selectors for the pageSession Redux slice.
 * Used by widgets/page-editor to read sync and lock state.
 *
 * @layer Entity
 */
export const selectActivePageId = (state: RootState) =>
  state.pageSession.activePageId

export const selectPageConnectionStatus = (state: RootState) =>
  state.pageSession.connectionStatus

export const selectIsPageLocked = (state: RootState) =>
  state.pageSession.isLocked

export const selectIsPageOnline = (state: RootState) =>
  state.pageSession.isOnline

export const selectPageYdocStatus = (state: RootState) =>
  state.pageSession.ydocStatus

export const selectIsSyncing = (state: RootState) => state.pageSession.isSyncing

export const selectSnapshotLoadedAt = (state: RootState) =>
  state.pageSession.snapshotLoadedAt

export const selectPendingUpdateCount = (state: RootState) =>
  state.pageSession.pendingUpdateCount
