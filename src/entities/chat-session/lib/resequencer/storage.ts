import type { NewMessagePayload } from '@/shared/ws/protocol'
import type { ConversationState } from './types'
import { db } from '@/shared/lib/db'

/**
 * Commits a message to the database and updates the conversation state.
 */
export async function commitMessage(
  state: ConversationState,
  payload: NewMessagePayload,
  projectId: string,
) {
  try {
    await db.transaction(
      'rw',
      [db.messages, db.conversation_state],
      async () => {
        await db.messages.put({
          ...payload,
          projectId, // Injected!
          id: payload.messageId,
          deliveryStatus: 'sent',
          replyCount: 0,
          reactions: [],
          attachments: [],
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
    state.lastCommitTs = Date.now()
  } catch (err) {
    throw err
  }
}

/**
 * Retrieves the last known cursor (Stream ID & Sequence) from DB.
 */
export async function getConversationCursor(
  conversationId: string,
): Promise<{ streamId: string | null; sequence: number }> {
  try {
    const cursor = (await db.conversation_state.get({ conversationId })) as any
    return {
      streamId: cursor?.lastStreamIdSeen || null,
      sequence: cursor?.lastSequence || 0,
    }
  } catch (e) {
    console.error('[ResequencerStorage] Failed to get cursor', e)
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
    console.error('[ResequencerStorage] Failed to reset storage', e)
    throw e
  }
}
