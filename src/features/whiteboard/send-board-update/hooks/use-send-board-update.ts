import { useCallback } from 'react'
import { sendBoardUpdate as sendUpdate } from '@/features/whiteboard/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:use-send-update')

/**
 * Hook for sending Y.js board updates
 *
 * Returns stable callback that can be attached to Y.Doc observer
 *
 * @param boardId - Board ID
 * @returns Stable callback function
 *
 * @example
 * ```tsx
 * const sendUpdate = useSendBoardUpdate(boardId)
 *
 * useEffect(() => {
 *   const observer = (update: Uint8Array) => {
 *     sendUpdate(update)
 *   }
 *   ydoc.on('update', observer)
 *   return () => ydoc.off('update', observer)
 * }, [ydoc, sendUpdate])
 * ```
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
