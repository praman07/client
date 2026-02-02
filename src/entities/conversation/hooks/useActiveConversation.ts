import { useEffect } from 'react'
import { setActiveConversation } from '../model/slice'
import type { ConversationType } from '..'
import { useAppDispatch } from '@/shared/hooks'

/**
 * Hook to set active conversation in Redux state
 * Automatically clears on unmount
 *
 * @example
 * // In a conversation route component
 * useActiveConversation(conversationId, 'CHANNEL')
 */
export function useActiveConversation(
  conversationId: string | null,
  conversationType: ConversationType | null,
) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (conversationId && conversationType) {
      dispatch(setActiveConversation({ conversationId, conversationType }))
    }

    // Cleanup: Clear active conversation on unmount
    return () => {
      dispatch(setActiveConversation(null))
    }
  }, [conversationId, conversationType, dispatch])
}
