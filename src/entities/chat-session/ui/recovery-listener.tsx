import { useEffect } from 'react'
import { registerHandler, RecoveryRequestedEvent } from '@/shared/ws/event-bus'
import type { NewMessagePayload } from '@/shared/ws/protocol'
import { resequencer } from '../lib/chat-resequencer'
import { useFetchDelta } from '../hooks/use-fetch-delta'

export const RecoveryListener = () => {
  const { fetchDelta } = useFetchDelta()

  useEffect(() => {
    // Subscribe to internal "Intent" from Resequencer
    const unsubscribe = registerHandler<RecoveryRequestedEvent>(
      'intent:recovery-requested',
      async (event) => {
        const { conversationId, projectId, lastSequence, gapSize } =
          event.payload

        console.log(
          `[RecoveryListener] Handling gap for ${conversationId} (Project: ${projectId}) > Seq: ${lastSequence} (Gap: ${gapSize})`,
        )

        // Safety: If no project ID (legacy state), we cannot commit to persistence.
        if (!projectId) {
          console.warn(
            '[RecoveryListener] Missing Project ID in recovery event',
          )
          return
        }

        try {
          // 1. Fetch from Backend (Imperative)
          // Sequence-based recovery (Deterministic)
          // For small gaps (< 5), fetch exactly what's missing
          // For larger gaps, add buffer to handle race conditions
          // CRITICAL: fetchLimit must be >= 1 for GraphQL validation
          const fetchLimit = Math.max(
            1,
            gapSize < 5 ? gapSize : Math.min(gapSize + 10, 100),
          )

          console.debug(
            `[RecoveryListener] Fetching ${fetchLimit} messages (gap: ${gapSize})...`,
          )

          const { messages } = await fetchDelta(
            conversationId,
            lastSequence,
            fetchLimit,
          )

          if (!messages || messages.length === 0) {
            console.warn(
              `[RecoveryListener] No messages found for ${conversationId}. Server history missing? Forcing cursor advance.`,
            )
            await resequencer.handleRecoveryGap(conversationId, projectId)
            return
          }

          console.log(
            `[RecoveryListener] Fetched ${messages.length} messages. Recovering...`,
          )

          // 2. Feed back to Engine
          // TODO: @DesignChoice - ProjectID is derived from event payload.
          // This avoids coupling the listener to the global store, maintaining FSD compliance.
          const mappedMessages: NewMessagePayload[] = messages.map(
            (msg: any) => ({
              id: msg.id,
              messageId: msg.id,
              streamId: msg.streamId,
              conversationId: msg.conversationId,
              content: msg.content,
              authorId: msg.authorUserId,
              sequence: msg.sequence,
              createdAt: msg.createdAt,
              dedupeId: `recovery-${msg.id}`,
              projectId: projectId,
            }),
          )

          await resequencer.processRecoveryBatch(mappedMessages, projectId)
        } catch (err) {
          console.error('[RecoveryListener] Recovery failed', err)
        }
      },
    )

    return () => unsubscribe()
  }, [fetchDelta])

  return null // Headless
}
