/**
 * STATE MANAGER: Resequencer state lifecycle management
 *
 * Responsibility: Initialize, retrieve, reload, and cleanup stream session states
 */

import type { StreamSessionState } from '../types/state'
import type { StorageAdapter } from '../adapters/storage-adapter'
import type { CursorLoader } from '../utils/cursor-loader'
import type { BasePayload } from './commit-handler'

export interface StateManager<T extends BasePayload> {
  get: (conversationId: string) => StreamSessionState<T> | undefined
  getOrInit: (
    conversationId: string,
    projectId?: string,
  ) => Promise<StreamSessionState<T>>
  reload: (conversationId: string) => Promise<void>
  reset: (conversationId: string, projectId?: string) => Promise<void>
  cleanup: () => void
  getAllActive: () => Array<string>
}

export function createStateManager<T extends BasePayload>(
  storageAdapter: StorageAdapter<T>,
  cursorLoader: CursorLoader,
): StateManager<T> {
  const states = new Map<string, StreamSessionState<T>>()
  const initPromises = new Map<string, Promise<StreamSessionState<T>>>()

  // Memory hygiene: cleanup stale states every 10 minutes
  setInterval(() => cleanup(), 10 * 60 * 1000)

  /**
   * Get existing state (no initialization)
   */
  function get(conversationId: string): StreamSessionState<T> | undefined {
    return states.get(conversationId)
  }

  /**
   * Get or initialize state (concurrency-safe)
   */
  async function getOrInit(
    conversationId: string,
    projectId?: string,
  ): Promise<StreamSessionState<T>> {
    // Fast path: existing state
    const existing = states.get(conversationId)
    if (existing) return existing

    // In-flight protection: don't duplicate init
    const inFlight = initPromises.get(conversationId)
    if (inFlight) return inFlight

    // Initialize new state
    const initTask = (async () => {
      const cursor = await cursorLoader.load(conversationId, projectId)

      // Double-check after async (concurrency safety)
      const check = states.get(conversationId)
      if (check) return check

      const newState: StreamSessionState<T> = {
        conversationId,
        projectId: projectId ?? null,
        expectedStreamId: cursor.expectedStreamId,
        lastSequence: cursor.lastSequence,
        lastStreamIdSeen: cursor.expectedStreamId,
        buffer: new Map(),
        status: 'SYNCED',
        gapTimer: null,
        lastCommitTs: Date.now(),
        processingChain: Promise.resolve(),
        recoveryAttempts: 0,
      }

      states.set(conversationId, newState)
      return newState
    })()

    initPromises.set(conversationId, initTask)

    try {
      return await initTask
    } finally {
      initPromises.delete(conversationId)
    }
  }

  /**
   * Reload state from storage (for multi-tab sync)
   */
  async function reload(conversationId: string): Promise<void> {
    const state = states.get(conversationId)
    if (!state) return

    const cursor = await cursorLoader.load(
      conversationId,
      state.projectId || undefined,
    )

    // Only advance, never regress (monotonicity)
    if (cursor.lastSequence > state.lastSequence) {
      console.log(
        `[StateManager] Reloading: ${state.lastSequence} -> ${cursor.lastSequence}`,
      )

      state.lastSequence = cursor.lastSequence
      state.expectedStreamId = cursor.expectedStreamId
      state.lastStreamIdSeen = cursor.expectedStreamId

      // Clear desync if caught up
      if (state.status === 'DESYNCED') {
        state.status = 'SYNCED'
      }
    }
  }

  /**
   * Hard reset conversation
   */
  async function reset(
    conversationId: string,
    projectId?: string,
  ): Promise<void> {
    states.delete(conversationId)
    await storageAdapter.reset(conversationId, projectId || '')
  }

  /**
   * Cleanup stale states (memory hygiene)
   */
  function cleanup(): void {
    const now = Date.now()
    const THRESHOLD = 60 * 60 * 1000 // 1 hour
    let evicted = 0

    for (const [id, state] of states.entries()) {
      if (now - state.lastCommitTs > THRESHOLD) {
        states.delete(id)
        evicted++
      }
    }

    if (evicted > 0) {
      console.log(`[StateManager] Evicted ${evicted} stale states`)
    }
  }

  /**
   * Get all active conversation IDs
   */
  function getAllActive(): Array<string> {
    return Array.from(states.keys())
  }

  return {
    get,
    getOrInit,
    reload,
    reset,
    cleanup,
    getAllActive,
  }
}
