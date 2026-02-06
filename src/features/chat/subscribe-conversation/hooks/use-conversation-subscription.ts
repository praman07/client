import { useEffect } from 'react'
import { wsManager } from '@/shared/ws'
import { useAppDispatch } from '@/shared/hooks'
import { initChannel } from '@/entities/chat-session/model/slice'
import { resequencer } from '@/entities/chat-session'

type ConversationType = 'CHANNEL' | 'DM' | 'GROUP_DM' | 'THREAD'

/**
 * Subscribe to a conversation's real-time events.
 * Handles subscription lifecycle and sync-on-connect recovery.
 */
export function useConversationSubscription(
  conversationId: string,
  projectId: string,
  conversationType: ConversationType = 'CHANNEL',
) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!conversationId) return
    dispatch(initChannel({ channelId: conversationId }))

    wsManager.subscribe({
      domain: 'chat',
      getId: (payload: { conversationId?: string }) =>
        payload.conversationId ?? conversationId,
      createPayload: async () => {
        const state = await resequencer.getSubscriptionState(
          conversationId,
          projectId,
        )
        return {
          conversationId,
          conversationType,
          lastSequence: state.lastSequence,
          epoch: state.epoch ?? undefined,
        }
      },
    })

    return () => {
      wsManager.unsubscribe('chat', conversationId)
    }
  }, [conversationId, projectId, conversationType, dispatch])
}
