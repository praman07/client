import { useAppSelector } from '@/shared/hooks'
import { selectYDocStatus, selectSnapshotLoadedAt } from '../model/selectors'

export function useSyncStatus() {
  const status = useAppSelector(selectYDocStatus)
  const loadedAt = useAppSelector(selectSnapshotLoadedAt)

  return {
    status,
    loadedAt,
    isLoading: status === 'loading',
    isSynced: status === 'synced',
    isError: status === 'error',
  }
}
