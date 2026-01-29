import { useEffect } from 'react'
import { wsManager } from '@/shared/ws/transport-manager'
import { useAppDispatch } from '@/shared/hooks'
import { initChannel } from '@/entities/chat-session/model/slice'

export function useChannelSubscription(channelId: string, projectId: string) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!channelId) return
    dispatch(initChannel({ channelId }))

    // Audit Fix: Smart Subscription (Sync-on-Connect)
    wsManager.subscribe(channelId, async () => {
      const { resequencer } =
        await import('@/entities/chat-session/lib/resequencer/coordinator')
      const state = await resequencer.getSubscriptionState(channelId, projectId)
      return {
        conversationId: channelId,
        lastSequence: state.lastSequence,
        epoch: state.epoch ?? undefined, // Convert null to undefined for protocol compatibility
      }
    })

    return () => {
      wsManager.unsubscribe(channelId)
    }
  }, [channelId, projectId, dispatch])
}
