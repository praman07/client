import { useEffect } from 'react'
import { wsManager } from '@/shared/ws'
import { useAppDispatch } from '@/shared/hooks'
import { initChannel } from '@/entities/chat-session/model/slice'
import { resequencer } from '@/entities/chat-session'

export function useChannelSubscription(channelId: string, projectId: string) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!channelId) return
    dispatch(initChannel({ channelId }))

    // Audit Fix: Smart Subscription (Sync-on-Connect)
    wsManager.subscribe({
      domain: 'chat',
      getId: (payload: any) => payload.conversationId || channelId,
      createPayload: async () => {
        const state = await resequencer.getSubscriptionState(
          channelId,
          projectId,
        )
        return {
          conversationId: channelId,
          lastSequence: state.lastSequence,
          epoch: state.epoch ?? undefined, // Convert null to undefined for protocol compatibility
        }
      },
    })

    return () => {
      wsManager.unsubscribe('chat', channelId)
    }
  }, [channelId, projectId, dispatch])
}
