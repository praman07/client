import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/shared/lib/db'
import { mergeMessages } from '../model/selectors'

interface UseMessageWindowProps {
  conversationId: string
  projectId: string
  minSequence: number
  maxSequence: number
}

/**
 * The Data Provider for the Message Virtual List.
 * Fetches a specific window of messages from Dexie and merges with the Outbox.
 *
 * Guarantee: ALWAYS returns a sorted array.
 * Guarantee: ALWAYS bounded by [minSequence, maxSequence] (plus outbox).
 */
export function useMessageWindow({
  conversationId,
  projectId,
  minSequence,
  maxSequence,
}: UseMessageWindowProps) {
  const messages = useLiveQuery(
    async () => {
      // DEBUG: Query params (uncomment for debugging)
      // console.log('[useMessageWindow] Query:', { projectId, conversationId, minSequence, maxSequence })

      // 1. Fetch Window from History
      // We use the Compound Index [projectId+conversationId+sequence]
      // Note: We include projectId in the index query for strict isolation
      const history = await db.messages
        .where('[projectId+conversationId+sequence]')
        .between(
          [projectId, conversationId, minSequence],
          [
            projectId,
            conversationId,
            maxSequence === Infinity
              ? Number.MAX_SAFE_INTEGER
              : maxSequence + 1,
          ],
          true, // includeLower
          true, // includeUpper
        )
        .toArray()

      // 2. Fetch Optimistic Outbox
      // Fetch ALL pending for this conversation (usually small, < 5 items)
      const outbox = await db.outbox
        .where({ conversationId, projectId })
        .toArray()

      // 3. Merge & Sort
      const merged = mergeMessages(history, outbox)

      // DEBUG: Query results (uncomment for debugging)
      // console.log('[useMessageWindow] Results:', { historyCount: history.length, mergedCount: merged.length })

      return merged
    },
    [conversationId, projectId, minSequence, maxSequence],
    [],
  ) // Default empty array

  return {
    messages: messages || [],
    isLoading: !messages,
  }
}
