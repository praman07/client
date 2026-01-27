import { useCallback } from 'react'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { GET_MISSING_MESSAGES } from '../api/fragments'

export function useFetchDelta() {
  const { getToken } = useAuth()

  const fetchDelta = useCallback(
    async (
      conversationId: string,
      afterSequence: number,
      limit: number = 50,
    ) => {
      const token = await getToken()
      if (!token) {
        console.warn('[ChatRecovery] No auth token available')
        return { messages: [], hasMore: false, lastSequence: 0 }
      }

      const client = GqlClient(token)
      try {
        const data = await client.request(GET_MISSING_MESSAGES, {
          conversationId,
          afterSequence, // Use Sequence Cursor
          limit,
        })
        return data.messagesDelta
      } catch (error) {
        console.error('[ChatRecovery] Failed to fetch delta:', error)
        throw error
      }
    },
    [getToken],
  )

  return { fetchDelta }
}
