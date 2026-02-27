import { useAppSelector } from '@/shared/hooks'
import {
  selectPageConnectionStatus,
  selectPageYdocStatus,
  selectIsPageLocked,
  selectIsPageOnline,
  selectIsSyncing,
} from '../model/selectors'

/**
 * Convenience hook for reading page sync status from Redux.
 * Used by widgets/page-editor and any feature that needs to know if the page
 * is connected/synced/locked.
 *
 * @layer Entity
 */
export function usePageSyncStatus() {
  const connectionStatus = useAppSelector(selectPageConnectionStatus)
  const ydocStatus = useAppSelector(selectPageYdocStatus)
  const isLocked = useAppSelector(selectIsPageLocked)
  const isOnline = useAppSelector(selectIsPageOnline)
  const isSyncing = useAppSelector(selectIsSyncing)

  return {
    connectionStatus,
    ydocStatus,
    isLocked,
    isOnline,
    isSyncing,
    isConnected: connectionStatus === 'connected',
    isSynced: ydocStatus === 'synced',
  }
}
