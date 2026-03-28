/**
 * CHAT RESEQUENCER: Chat-specific wrapper over generic stream resequencer
 *
 * Provides typed API for NewMessagePayload and integrates with chat storage
 */

import {
  commitMessage,
  getConversationCursor,
  resetConversationStorage,
} from './resequencer/storage'
import type { NewMessagePayload } from '@/shared/contracts/chat/downstream'
import type {
  BasePayload,
  CursorState,
  RecoveryAdapter,
  StorageAdapter,
} from '@/entities/stream-session'
import { createStreamResequencer } from '@/entities/stream-session'
import { dispatchEvent } from '@/shared/ws/event-bus'

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
      lastOpenedAt: cursor.lastOpenedAt,
    }
  },

  reset: async (conversationId) => {
    await resetConversationStorage(conversationId)
  },
}

// Chat recovery adapter
const chatRecoveryAdapter: RecoveryAdapter = {
  triggerRecovery: (request) => {
    // Dispatch to EventBus for RecoveryListener to handle
    dispatchEvent({
      type: 'intent:recovery-requested',
      payload: {
        conversationId: request.conversationId,
        projectId: request.projectId,
        lastStreamId: request.lastStreamId,
        lastSequence: request.lastSequence,
        gapSize: request.gapSize,
      },
    })
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
