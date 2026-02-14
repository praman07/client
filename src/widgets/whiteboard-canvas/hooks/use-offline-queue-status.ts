import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/shared/lib/db'

/**
 * Offline Queue Status Hook - Widget Layer
 *
 * Provides real-time queue status for UI display.
 * Uses Dexie live queries for automatic reactivity.
 *
 * @param boardId - Board ID to monitor
 * @returns Queue status (pending count, sync status)
 *
 * @example
 * const { pendingCount, isSyncing, syncStatus } = useOfflineQueueStatus(boardId)
 *
 * <ConnectionIndicator status={syncStatus} pending={pendingCount} />
 */
export function useOfflineQueueStatus(boardId: string) {
  const pendingCount = useLiveQuery(
    () =>
      db.whiteboardOfflineUpdates.where({ boardId, status: 'pending' }).count(),
    [boardId],
    0,
  )

  const isSyncing = useLiveQuery(
    () =>
      db.whiteboardOfflineUpdates
        .where({ boardId, status: 'sending' })
        .count()
        .then((count) => count > 0),
    [boardId],
    false,
  )

  return {
    /**
     * Number of pending updates in queue
     */
    pendingCount: pendingCount ?? 0,

    /**
     * True if currently sending merged update
     */
    isSyncing: isSyncing ?? false,

    /**
     * True if any pending updates exist
     */
    hasPending: (pendingCount ?? 0) > 0,

    /**
     * Sync status for UI
     * - 'synced': No pending updates
     * - 'pending': Updates queued, not sending yet
     * - 'syncing': Currently sending merged update
     */
    syncStatus: isSyncing
      ? ('syncing' as const)
      : (pendingCount ?? 0) > 0
        ? ('pending' as const)
        : ('synced' as const),
  }
}
