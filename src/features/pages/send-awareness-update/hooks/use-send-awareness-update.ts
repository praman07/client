import { useCallback } from 'react'
import { sendAwarenessUpdate } from '@/features/pages/events'

/**
 * Stable callback hook for sending awareness updates.
 * Called by PageAwarenessProvider when local cursor moves.
 *
 * @layer Features
 */
export function useSendAwarenessUpdate(pageId: string) {
  return useCallback(
    (update: Uint8Array): void => {
      sendAwarenessUpdate(pageId, update)
    },
    [pageId],
  )
}
