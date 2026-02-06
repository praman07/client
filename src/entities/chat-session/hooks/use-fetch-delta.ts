import { useCallback } from 'react'
import { GET_MISSING_MESSAGES } from '../api'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:recovery')

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
        log.warn('No auth token available')
        return { messages: [], hasMore: false, lastSequence: 0 }
      }

      const client = GqlClient(token)
      try {
        const data = await client.request(GET_MISSING_MESSAGES, {
          conversationId,
          afterSequence: afterSequence ?? 0, // Use Sequence Cursor (Safety Default)
          limit,
        })
        return data.messagesDelta
      } catch (error) {
        log.error('Failed to fetch delta:', error)
        throw error
      }
    },
    [getToken],
  )

  return { fetchDelta }
}
