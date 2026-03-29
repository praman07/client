import type { NewMessagePayload } from '@/shared/contracts/chat/downstream'
import type { StreamSessionState } from '@/entities/stream-session'
import type { ConversationState as DBConversationState } from '@/shared/lib/db/schema'
import { db } from '@/shared/lib/db'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('reseq:storage')

/**
 * Commits a message to the database and updates the conversation state.
 */
export async function commitMessage(
  state: StreamSessionState<NewMessagePayload>,
  payload: NewMessagePayload,
  projectId: string,
) {
  await db.transaction(
    'rw',
    [db.messages, db.conversation_state],
    async () => {
      // Strip url from attachments — presigned URLs are short-lived (1h TTL).
      // Only fileId, name, mimeType, sizeBytes are safe to persist in IndexDB.
      const safeMetadata = payload.metadata
        ? {
            ...payload.metadata,
            attachments: payload.metadata.attachments?.map(
               
              ({ url: _url, ...rest }) => rest,
            ),
          }
        : undefined

      await db.messages.put({
        ...payload,
        metadata: safeMetadata,
        projectId, // Injected!
        id: payload.messageId,
        deliveryStatus: 'sent',
        reactions: [],
      } as any)

      await db.conversation_state.put({
        conversationId: state.conversationId,
        projectId,
        lastStreamIdSeen: payload.streamId,
        lastSequence: payload.sequence, // Persist Sequence
        lastOpenedAt: Date.now(),
         
      } as any)
    },
  )
  // Updates memory ONLY after DB commit
  state.expectedStreamId = payload.streamId
  state.lastSequence = payload.sequence!
  state.lastStreamIdSeen = payload.streamId // Hybrid: Keep in sync!
  state.lastCommitTs = Date.now()
}

/**
 * BATCH COMMIT: Commits multiple messages in a single transaction.
 * This is critical for history loading - triggers only ONE LiveQuery update
 * instead of N updates, enabling proper scroll anchor preservation.
 */
export async function commitMessageBatch(
  payloads: Array<NewMessagePayload>,
  projectId: string,
) {
  if (payloads.length === 0) return

  // Sort by sequence to ensure correct order
  const sorted = [...payloads].sort(
    (a, b) => a.sequence - b.sequence,
  )

  try {
    await db.transaction(
      'rw',
      [db.messages, db.conversation_state],
      async () => {
        // Batch insert all messages
        const messagesToInsert = sorted.map((payload) => {
          const safeMetadata = payload.metadata
            ? {
                ...payload.metadata,
                attachments: payload.metadata.attachments?.map(
                   
                  ({ url: _url, ...rest }) => rest,
                ),
              }
            : undefined
          return {
            ...payload,
            metadata: safeMetadata,
            projectId,
            id: payload.messageId,
            deliveryStatus: 'sent' as const,
            reactions: [],
          }
        })
         
        await db.messages.bulkPut(messagesToInsert as any)

        // Update conversation state with the LAST (highest sequence) message
        // Note: For history, we DON'T update lastSequence if older than current
        // This preserves the "newest message seen" cursor for realtime
      },
    )

    log.debug(`Batch committed ${sorted.length} messages`)
  } catch (err) {
    log.error('Batch commit failed:', err)
    throw err
  }
}

/**
 * Retrieves the last known cursor (Stream ID & Sequence) from DB.
 * Uses compound key [projectId+conversationId] for efficient lookup.
 *
 * MIGRATION FALLBACK: If cursor.sequence is 0/undefined but messages exist,
 * derive lastSequence from the max sequence in messages table.
 */
export async function getConversationCursor(
  conversationId: string,
  projectId?: string,
): Promise<{ streamId: string | null; sequence: number; lastOpenedAt?: number }> {
  try {
    let cursor: DBConversationState | undefined

    // 1. Fast Path: Use compound key if projectId is available
    if (projectId) {
      cursor = await db.conversation_state.get([projectId, conversationId])
    }

    // 2. Fallback: Search by conversationId index (slower but works)
    if (!cursor) {
      cursor = await db.conversation_state
        .where('conversationId')
        .equals(conversationId)
        .first()
    }

    let sequence = cursor?.lastSequence ?? 0
    const streamId = cursor?.lastStreamIdSeen ?? null

    // 3. MIGRATION FALLBACK: Derive sequence from messages if cursor.sequence is 0
    // This handles records created before lastSequence was added to the schema
    if (sequence === 0 && projectId) {
      const latestMessage = await db.messages
        .where('[projectId+conversationId+sequence]')
        .between(
          [projectId, conversationId, 0],
          [projectId, conversationId, Number.MAX_SAFE_INTEGER],
        )
        .last()

      if (latestMessage?.sequence) {
        sequence = latestMessage.sequence
        log.debug('Migration: Derived sequence from messages:', sequence)

        // Backfill the cursor record for future lookups
        if (cursor && projectId) {
          await db.conversation_state.put({
            ...cursor,
            lastSequence: sequence,
          })
        }
      }
    }

    // DEBUG: Cursor lookup (uncomment for debugging)
    // console.log('[Storage] getConversationCursor:', { conversationId, sequence, foundCursor: !!cursor })

    return {
      streamId,
      sequence,
      lastOpenedAt: cursor?.lastOpenedAt,
    }
  } catch (e) {
    log.error('Failed to get cursor', e)
    return { streamId: null, sequence: 0 }
  }
}

/**
 * Hard resets the conversation data in the DB.
 */
export async function resetConversationStorage(conversationId: string) {
  try {
    await db.transaction(
      'rw',
      [db.messages, db.conversation_state],
      async () => {
        await db.messages.where({ conversationId }).delete()
        await db.conversation_state.delete(conversationId)
      },
    )
  } catch (e) {
    log.error('Failed to reset storage', e)
    throw e
  }
}
