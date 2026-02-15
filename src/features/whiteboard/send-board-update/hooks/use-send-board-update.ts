import { useCallback } from 'react'
import { sendBoardUpdate as sendUpdate } from '@/features/whiteboard/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:use-send-update')

/**
 * Hook for sending Y.js board updates
 */


export function useSendBoardUpdate(boardId: string) {
  return useCallback(
    async (update: Uint8Array) => {
      try {
        await sendUpdate(boardId, update)
      } catch (error) {
        log.error('Failed to send update', error)
        // Error already logged in sendUpdate, don't throw to avoid breaking Y.js
      }
    },
    [boardId],
  )
}
