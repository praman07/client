import { useCallback, useRef, useState } from 'react'
import { GET_HISTORY } from '../api'
import { commitMessageBatch } from '../lib/resequencer/storage'
import type { NewMessagePayload } from '@/shared/contracts/chat/downstream'
import { GqlClient, getFragmentData } from '@/shared/api'

import { useAuth } from '@/shared/hooks'
import { MessageRecoveryFieldsFragmentDoc } from '@/gql/graphql'

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
        if (historyData.messages.length > 0) {
          // ARCHITECTURE: Unidirectional Data Flow
          // 1. Fetch from Network (GQL)
          // 2. Ingest via Resequencer (Normalizes & Persists to Dexie)
          // 3. UI Updates via LiveQuery (useMessageWindow)

          // ADAPTER: Map GQL Fragment -> WebSocket Protocol Payload
          // The resequencer expects the same shape as live updates.
          const payloadBatch: Array<NewMessagePayload> =
            historyData.messages.map((maskedMsg) => {
              const msg = getFragmentData(
                MessageRecoveryFieldsFragmentDoc,
                maskedMsg,
              )

              // Extract rich content from GraphQL JSON scalar.
              // The server sends { text, mentions } as a JSON object which GraphQL
              // serializes as a string over the wire. JSONResolver does NOT auto-parse
              // back to JS object on the client, so we handle both shapes here.
              const rawContent = msg.content
              let safeContent = ''

              log.debug('Processing message content:', {
                messageId: msg.id,
                contentType: typeof rawContent,
                contentPreview: typeof rawContent === 'string'
                  ? (rawContent.length > 100 ? rawContent.slice(0, 100) + '...' : rawContent)
                  : JSON.stringify(rawContent),
              })

              if (typeof rawContent === 'string') {
                // Shape A: JSON string (from GraphQL JSON scalar serialization)
                try {
                  const parsed = JSON.parse(rawContent)
                  if (parsed && typeof parsed === 'object' && 'text' in parsed) {
                    safeContent = parsed.text ?? ''
                    // If mentions exist, keep full rich content — the renderer
                    // (RichChatContent) expects the full { text, mentions } shape.
                    if (Array.isArray(parsed.mentions) && parsed.mentions.length > 0) {
                      safeContent = rawContent // preserve rich JSON for renderer
                    }
                  } else {
                    safeContent = rawContent // plain string
                  }
                } catch {
                  safeContent = rawContent // non-JSON plain text
                }
              } else if (rawContent && typeof rawContent === 'object') {
                // Shape B: Already an object (unlikely but defensive)
                safeContent = (rawContent as { text?: string }).text ?? JSON.stringify(rawContent)
              } else {
                safeContent = String(rawContent ?? '')
              }

              return {
                messageId: msg.id,
                streamId: msg.streamId,
                dedupeId: msg.streamId,
                conversationId: msg.conversationId,
                authorId: msg.authorUserId,
                content: safeContent,
                createdAt: msg.createdAt,
                sequence: msg.sequence,
                threadId: undefined,
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