import { useEffect } from 'react'
import { offlineQueue } from '@/entities/whiteboard-session'
import { useOnlineStatus } from '@/shared/hooks/use-online-status'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:flush-queue')

/**
 * Flush Offline Queue Hook - Widget Layer
 *
 * Automatically flushes pending offline updates when network is restored.
 * Debounced in the queue manager to handle rapid reconnects.
 *
 * @param boardId - Board ID to flush
 *
 * @example
 * useFlushOfflineQueue(boardId)
 */
export function useFlushOfflineQueue(boardId: string) {
  const isOnline = useOnlineStatus()

  useEffect(() => {
    if (isOnline) {
      log.info('Network restored, flushing queue', { boardId })
      offlineQueue.flush(boardId)
    }
  }, [boardId, isOnline])
}
