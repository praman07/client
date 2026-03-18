import { useCallback, useSyncExternalStore } from 'react'
import { resequencer } from '../lib/chat-resequencer'

/**
 * Hook to subscribe to resequencer status changes using useSyncExternalStore.
 */
export function useResequencerStatus(conversationId: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return resequencer.subscribe(conversationId, onStoreChange)
    },
    [conversationId],
  )

  const getSnapshot = useCallback(() => {
    return resequencer.getStatus(conversationId)
  }, [conversationId])

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
