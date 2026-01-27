import { useCallback } from 'react'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { GET_MISSING_MESSAGES } from '../api/fragments'

export function useFetchDelta() {
  const { getToken } = useAuth()

  const fetchDelta = useCallback(
    async (
      conversationId: string,
      afterStreamId: string,
      limit: number = 50,
    ) => {
      const token = await getToken()
      if (!token) {
        console.warn('[ChatRecovery] No auth token available')
        return []
      }

      const client = GqlClient(token)
      try {
        const data = await client.request(GET_MISSING_MESSAGES, {
          conversationId,
          afterStreamId,
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
