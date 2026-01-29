import { GqlClient } from '@/shared/api'
import { resequencer } from '@/entities/chat-session'
import type { NewMessagePayload } from '@/shared/ws/protocol'

import { useAuth } from '@/shared/hooks'
import { useCallback, useState, useRef } from 'react'
import { GET_HISTORY } from '@/entities/chat-session/api/fragments'
import { MessageRecoveryFieldsFragmentDoc } from '@/gql/graphql'
import { useFragment } from '@/gql/fragment-masking'

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
          const payloadBatch: NewMessagePayload[] = historyData.messages.map(
            (maskedMsg) => {
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
                content:
                  typeof msg.content === 'string'
                    ? msg.content
                    : JSON.stringify(msg.content), // Ensure string protocol
                createdAt: msg.createdAt,
                sequence: msg.sequence,
                threadId: undefined, // TODO: Add thread support if needed
              }
            },
          )
          // The original code had an extra closing parenthesis for the map function.
          // The provided snippet had a syntax error with an extra `})` at the end of the map.
          // Corrected to ensure valid syntax.

          await resequencer.processRecoveryBatch(payloadBatch, projectId)
          return historyData.messages.length
        }
        return 0
      } catch (err) {
        console.error('[HistoryLoader] Fetch failed', err)
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
