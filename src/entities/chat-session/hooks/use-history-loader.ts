import { useCallback, useRef, useState } from 'react'
import { GET_HISTORY } from '../api'
import { commitMessageBatch } from '../lib/resequencer/storage'
import type { NewMessagePayload } from '@/shared/contracts/chat/downstream'
import { GqlClient } from '@/shared/api'

import { useAuth } from '@/shared/hooks'
import { MessageRecoveryFieldsFragmentDoc } from '@/gql/graphql'
import { useFragment } from '@/gql/fragment-masking'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:history')

/**
 * Controller Hook for fetching historical messages.
 *
 * Responsibilities:
 * - Fetches paginated history from Backend
 * - Feeds data into the Resequencer (Core Logic)
 * - Does NOT directly update state/UI (relies on DB Reactivity)
 */
export function useHistoryLoader() {
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const fetchLock = useRef(false)

  const loadMore = useCallback(
    async (
      conversationId: string,
      projectId: string,
      beforeSequence: number,
      limit: number = 50,
    ) => {
      // Concurrency Guard: Prevent double-fetching
      if (fetchLock.current) return 0

      const token = await getToken()
      if (!token) throw new Error('No Auth Token')

      fetchLock.current = true
      setIsLoading(true)

      const client = GqlClient(token)

      try {
        const data = await client.request(GET_HISTORY, {
          conversationId,
          beforeSequence,
          limit,
        })

        const historyData = data.history
        if (historyData?.messages && historyData.messages.length > 0) {
          // ARCHITECTURE: Unidirectional Data Flow
          // 1. Fetch from Network (GQL)
          // 2. Ingest via Resequencer (Normalizes & Persists to Dexie)
          // 3. UI Updates via LiveQuery (useMessageWindow)

          // ADAPTER: Map GQL Fragment -> WebSocket Protocol Payload
          // The resequencer expects the same shape as live updates.
          const payloadBatch: Array<NewMessagePayload> =
            historyData.messages.map((maskedMsg) => {
              const msg = useFragment(
                MessageRecoveryFieldsFragmentDoc,
                maskedMsg,
              )
              return {
                messageId: msg.id,
                streamId: msg.streamId,
                dedupeId: msg.streamId, // In history, streamId is the unique proof
                conversationId: msg.conversationId,
                authorId: msg.authorUserId,
                // Extract text from content object or use raw string
                content:
                  typeof msg.content === 'string'
                    ? msg.content
                    : (msg.content?.text ?? JSON.stringify(msg.content)),
                createdAt: msg.createdAt,
                sequence: msg.sequence,
                threadId: undefined, // TODO: Add thread support if needed
              }
            })
          // CRITICAL: Use batch commit for single DB transaction
          // This triggers only ONE LiveQuery update, enabling scroll anchor preservation
          // Individual commits would cause N re-renders with delta=1 each
          await commitMessageBatch(payloadBatch, projectId)
          return historyData.messages.length
        }
        return 0
      } catch (err) {
        log.error('Fetch failed', err)
        throw err
      } finally {
        fetchLock.current = false
        setIsLoading(false)
      }
    },
    [getToken],
  )

  return { loadMore, isLoading }
}
