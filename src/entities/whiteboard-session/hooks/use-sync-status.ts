import { selectSnapshotLoadedAt, selectYDocStatus } from '../model/selectors'
import { useAppSelector } from '@/shared/hooks'

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
