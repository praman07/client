import { useEffect } from 'react'
import { wsManager } from '@/shared/ws'
import { useAppDispatch } from '@/shared/hooks'
import { initChannel, resequencer } from '@/entities/chat-session'
import { db } from '@/shared/lib/db'

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

        // Delta sync: replay any reaction events missed while offline.
        // The reaction-events Redis Stream holds entries for 7 days;
        // we replay from the lastOpenedAt cursor (converted to stream
        // millisecond format: "<ms>-0").
        const lastReactionEventId = state.lastOpenedAt
          ? `${state.lastOpenedAt}-0`
          : '0-0'

        wsManager.emit('chat:sync-reactions' as any, {
          conversationId,
          lastEventId: lastReactionEventId,
        })

        return {
          conversationId,
          conversationType,
          lastSequence: state.lastSequence,
          epoch: state.epoch ?? undefined,
          // Mutation delta cursor: tells the server to replay any edits/deletes
          // that happened since the client was last connected.
          // Converts epoch ms → ISO 8601 (Zod datetime requires ISO format).
          lastOpenedAt: state.lastOpenedAt
            ? new Date(state.lastOpenedAt).toISOString()
            : undefined,
        }
      },
    })

    return () => {
      // Stamp the disconnect time so the next subscribe sends an accurate
      // lastOpenedAt cursor in the mutation delta query.
      db.conversation_state
        .where('[projectId+conversationId]')
        .equals([projectId, conversationId])
        .modify({ lastOpenedAt: Date.now() })
        .catch(() => {}) // not critical — cursor will just be slightly stale

      wsManager.unsubscribe('chat', conversationId)
    }
  }, [conversationId, projectId, conversationType, dispatch])
}
