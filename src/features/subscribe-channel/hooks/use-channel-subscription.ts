import { useEffect } from 'react'
import { wsManager } from '@/shared/ws/transport-manager'
import { useAppDispatch } from '@/shared/hooks'
import { initChannel } from '@/entities/chat-session/model/slice'

export function useChannelSubscription(channelId: string, projectId: string) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!channelId) return
    dispatch(initChannel({ channelId }))
    wsManager.subscribe(channelId)
    return () => {
      wsManager.unsubscribe(channelId)
    }
  }, [channelId, projectId, dispatch])
}
