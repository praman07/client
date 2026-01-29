/**
 * CHAT RESEQUENCER: Chat-specific wrapper over generic stream resequencer
 *
 * Provides typed API for NewMessagePayload and integrates with chat storage
 */

import {
  createStreamResequencer,
  type RecoveryAdapter,
  type StorageAdapter,
  type CursorState,
  type BasePayload,
} from '@/entities/stream-session'
import type { NewMessagePayload } from '@/shared/ws/protocol'
import {
  commitMessage,
  getConversationCursor,
  resetConversationStorage,
} from './resequencer/storage'

// NewMessagePayload extends BasePayload
type ChatPayload = NewMessagePayload & BasePayload

// Chat storage adapter
const chatStorageAdapter: StorageAdapter<ChatPayload> = {
  commit: async (state, payload, projectId) => {
    await commitMessage(state, payload as NewMessagePayload, projectId)
  },

  getCursor: async (conversationId, projectId): Promise<CursorState> => {
    const cursor = await getConversationCursor(conversationId, projectId)
    return {
      lastSequence: cursor.sequence,
      expectedStreamId: cursor.streamId,
      epoch: null,
    }
  },

  reset: async (conversationId) => {
    await resetConversationStorage(conversationId)
  },
}

// Chat recovery adapter
const chatRecoveryAdapter: RecoveryAdapter = {
  triggerRecovery: (request) => {
    // Dispatch custom event for chat feature layer to handle
    const event = new CustomEvent('chat-recovery-needed', {
      detail: request,
    })
    window.dispatchEvent(event)
  },
}

// Create chat resequencer instance
const chatResequencer = createStreamResequencer<ChatPayload>({
  storageAdapter: chatStorageAdapter,
  recoveryAdapter: chatRecoveryAdapter,
})

// Backward compatibility export
export const resequencer = chatResequencer

// Named export
export { chatResequencer }
