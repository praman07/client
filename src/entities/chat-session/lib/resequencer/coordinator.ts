import { compareStreamId, safeParseStreamId } from './stream-id'
import { processMessageInternal } from './engine'
import { getConversationCursor, resetConversationStorage } from './storage'
import { triggerRecovery } from './recovery'
import type { ConversationState } from './types'
import type { NewMessagePayload } from '@/shared/ws/protocol'
import { leaderElection } from '@/shared/lib/broadcast/leader-election'

/**
 * The Resequencer Coordinator
 * Manages state initialization, locking, and public API.
 */
class ChatResequencer {
  private states = new Map<string, ConversationState>()
  private initPromises = new Map<string, Promise<ConversationState>>()

  constructor() {
    // Audit P3: Memory Hygiene
    // Clean up stale states every 10 minutes
    setInterval(() => this.cleanupStaleStates(), 10 * 60 * 1000)
  }

  /**
   * Evicts states inactive for > 1 hour.
   * Safe because getOrInitState will reload cursor from DB if needed.
   */
  private cleanupStaleStates() {
    const now = Date.now()
    const THRESHOLD = 60 * 60 * 1000 // 1 Hour
    let evicted = 0

    for (const [id, state] of this.states.entries()) {
      if (now - state.lastCommitTs > THRESHOLD) {
        this.states.delete(id)
        evicted++
      }
    }
    if (evicted > 0) {
      console.log(`[Resequencer] Evicted ${evicted} stale states`)
    }
  }

  /**
   * Main Entry Point: Process a new message from the WebSocket.
   * Serialized per conversation to prevent race conditions.
   * @param payload The message payload
   * @param projectId The active project context (injected from UI state)
   */
  async processNewMessage(payload: NewMessagePayload, projectId: string) {
    const state = await this.getOrInitState(payload.conversationId, projectId)

    // 2.H Isolation: Ensure Project Context matches State
    if (state.projectId && state.projectId !== projectId) {
      console.error(
        `[Resequencer] Cross-Project Leak Detected! State Project: ${state.projectId} vs Incoming: ${projectId}`,
      )
      return Promise.resolve() // Reject safely
    }

    // Initialize Project ID if missing (First message scenario)
    if (!state.projectId && projectId) {
      state.projectId = projectId
    }

    state.lastCommitTs = Date.now() // Activity Touch

    const task = async () => {
      const isReplay = payload.meta?.replay || false
      await processMessageInternal(state, payload, projectId, isReplay)
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

    // Init state properly
    const state = await this.getOrInitState(sorted[0].conversationId, projectId)

    // Disable gap timer during recovery batch
    if (state.gapTimer) {
      clearTimeout(state.gapTimer)
      state.gapTimer = null
    }

    const task = async () => {
      for (const msg of sorted) {
        // Bypass gap detection: isReplay=true
        await processMessageInternal(state, msg, projectId, true)
      }
      state.status = 'SYNCED'
    }

    // Chain execution
    state.processingChain = state.processingChain.then(task).catch((err) => {
      console.error(
        `[Resequencer] Error in recovery batch for ${sorted[0].conversationId}`,
        err,
      )
    })

    return state.processingChain
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
   * Forces the sequence to advance when recovery fails (Server Reset / Data Loss).
   * This accepts the gap and moves the cursor forward to allow new messages.
   */
  async handleRecoveryGap(conversationId: string, projectId: string) {
    const state = await this.getOrInitState(conversationId, projectId)

    // 1. Force Flush Buffer (commits whatever future messages we have)
    // This naturally advances the sequence to the latest buffered message
    await import('./engine').then((m) =>
      m.flushBuffer(state, projectId, 'force'),
    )

    state.status = 'SYNCED'
    console.warn(`[Resequencer] Force-healed gap for ${conversationId}`)
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
      const { streamId, sequence } = await getConversationCursor(
        conversationId,
        projectId,
      )

      // 1.F Validation: Ensure stored cursor is valid. If corrupt, discard.
      let validStreamId = safeParseStreamId(streamId)
      if (streamId && !validStreamId) {
        console.error(
          `[Resequencer] Corrupted StreamID in storage: ${streamId}. Resetting cursor.`,
        )
        // We do not reset the whole DB here to avoid data loss, just the memory cursor.
        // The recovery mechanism will handle the rest.
        validStreamId = null
      }

      // Double check after await (though initPromises protects us, standard double-check doesn't hurt)
      if (this.states.has(conversationId)) {
        return this.states.get(conversationId)!
      }

      // If no stream ID exists (fresh conversation), successful sync starts at '0-0'
      const initialStreamId = validStreamId || '0-0'

      const newState: ConversationState = {
        conversationId,
        projectId: projectId ?? null,
        expectedStreamId: initialStreamId,
        lastSequence: sequence ?? 0, // Init from DB or default to 0
        lastStreamIdSeen: initialStreamId, // Deduplication Truth
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
  /**
   * Reloads state from storage.
   * critical for Multi-Tab Sync and Post-History Fetch updates.
   */
  async reloadStateFromStorage(conversationId: string) {
    const state = this.states.get(conversationId)
    const { streamId, sequence } = await getConversationCursor(
      conversationId,
      state?.projectId ?? undefined,
    )

    if (state) {
      const validStreamId = safeParseStreamId(streamId) || '0-0'
      const validSequence = sequence ?? 0

      // Only advance, never regress (Monotonicity Check)
      if (validSequence > state.lastSequence) {
        console.log(
          `[Resequencer] Reloading State: ${state.lastSequence} -> ${validSequence}`,
        )
        state.lastSequence = validSequence
        state.expectedStreamId = validStreamId // Legacy
        state.lastStreamIdSeen = validStreamId // Hybrid

        // If we caught up, clear desync status
        if (state.status === 'DESYNCED') {
          state.status = 'SYNCED'
        }
      }
    }
  }

  /**
   * Public Accessor for UI (Audit 3.K)
   */
  public getStatus(conversationId: string) {
    const state = this.states.get(conversationId)
    return state?.status || 'SYNCED'
  }

  /**
   * Used by Transport Layer to generate smart subscription payloads.
   * Returns current cursor state (sequence + epoch).
   *
   * IMPORTANT: This is async because on reload, in-memory state may be empty
   * and we must read from Dexie to avoid replaying all messages.
   */
  public async getSubscriptionState(
    conversationId: string,
    projectId?: string,
  ) {
    // 1. Fast Path: Use in-memory state if available
    const state = this.states.get(conversationId)
    if (state) {
      return {
        lastSequence: state.lastSequence,
        epoch: state.expectedStreamId,
      }
    }

    // 2. Slow Path: Read from Dexie (critical on reload)
    const { streamId, sequence } = await getConversationCursor(
      conversationId,
      projectId,
    )
    return {
      lastSequence: sequence ?? 0,
      epoch: streamId ?? undefined,
    }
  }

  /**
   * Called when this tab is promoted to Leader.
   * Reloads state for all tracked conversations from storage
   * to prevent false gap detection due to staleness.
   */
  public async refreshAllActive() {
    const activeIds = Array.from(this.states.keys())
    console.log(`[Resequencer] Hydrating ${activeIds.length} active channels`)
    await Promise.all(activeIds.map((id) => this.reloadStateFromStorage(id)))
  }
}

export const resequencer = new ChatResequencer()

// ARCHITECTURE: Leader Promotion Handling
// When this tab becomes Leader, its in-memory state might be stale (cold).
// We must reload from Storage to update 'lastSequence' before processing new events.

leaderElection.subscribe((state) => {
  if (state === 'LEADER') {
    resequencer.refreshAllActive()
  }
})
