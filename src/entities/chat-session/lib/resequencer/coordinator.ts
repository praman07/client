import { compareStreamId } from './stream-id'
import { processMessageInternal } from './engine'
import { getLastStreamId, resetConversationStorage } from './storage'
import { triggerRecovery } from './recovery'
import type { ConversationState } from './types'
import type { NewMessagePayload } from '@/shared/ws/protocol'

/**
 * The Resequencer Coordinator
 * Manages state initialization, locking, and public API.
 */
class ChatResequencer {
  private states = new Map<string, ConversationState>()
  private initPromises = new Map<string, Promise<ConversationState>>()

  /**
   * Main Entry Point: Process a new message from the WebSocket.
   * Serialized per conversation to prevent race conditions.
   * @param payload The message payload
   * @param projectId The active project context (injected from UI state)
   */
  async processNewMessage(payload: NewMessagePayload, projectId: string) {
    const state = await this.getOrInitState(payload.conversationId, projectId)

    const task = async () => {
      await processMessageInternal(state, payload, projectId)
    }

    // Chain the task to ensure sequential execution
    state.processingChain = state.processingChain.then(task).catch((err) => {
      console.error(
        `[Resequencer] Error in processing chain for ${payload.conversationId}`,
        err,
      )
    })

    return state.processingChain
  }

  /**
   * Public Recovery API
   */
  async processRecoveryBatch(
    messages: Array<NewMessagePayload>,
    projectId: string,
  ) {
    if (!messages.length) return
    const sorted = [...messages].sort((a, b) =>
      compareStreamId(a.streamId, b.streamId),
    )
    for (const msg of sorted) {
      // Enqueue into concurrency chain
      await this.processNewMessage(msg, projectId)
    }
  }

  /**
   * Handles sync required signal from external sources (e.g. UI)
   */
  public async handleSyncRequired(conversationId: string) {
    console.warn(`[Resequencer] Sync Required for ${conversationId}`)
    const state = await this.getOrInitState(conversationId)
    state.buffer.clear()
    state.status = 'DESYNCED'
    triggerRecovery(state)
  }

  /**
   * Hard reset for a conversation.
   */
  async resetConversation(conversationId: string) {
    this.states.delete(conversationId) // Clear mem
    await resetConversationStorage(conversationId)

    const state = await this.getOrInitState(conversationId)
    state.status = 'DESYNCED'
    triggerRecovery(state)
  }

  /**
   * Internal State Initializer
   * Handles concurrency deduplication
   */
  private async getOrInitState(
    conversationId: string,
    projectId?: string,
  ): Promise<ConversationState> {
    // 1. Fast Path
    let state = this.states.get(conversationId)
    if (state) return state

    // 2. In-Flight Protection
    if (this.initPromises.has(conversationId)) {
      return this.initPromises.get(conversationId)!
    }

    // 3. Initialization
    const initTask = (async () => {
      const lastStreamId = await getLastStreamId(conversationId)

      // Double check after await (though initPromises protects us, standard double-check doesn't hurt)
      if (this.states.has(conversationId)) {
        return this.states.get(conversationId)!
      }

      // If no stream ID exists (fresh conversation), successful sync starts at '0-0'
      const initialStreamId = lastStreamId || '0-0'

      const newState: ConversationState = {
        conversationId,
        projectId: projectId ?? null,
        expectedStreamId: initialStreamId,
        buffer: new Map(),
        status: 'SYNCED', // Since we default to 0-0, we are "Synced" at the start
        gapTimer: null,
        lastCommitTs: Date.now(),
        processingChain: Promise.resolve(), // Init with resolved promise
        recoveryAttempts: 0,
      }

      this.states.set(conversationId, newState)
      return newState
    })()

    this.initPromises.set(conversationId, initTask)

    try {
      const result = await initTask
      return result
    } finally {
      this.initPromises.delete(conversationId)
    }
  }
}

export const resequencer = new ChatResequencer()
