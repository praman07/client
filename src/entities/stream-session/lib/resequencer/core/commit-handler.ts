/**
 * COMMIT HANDLER: Database commit with retry logic
 *
 * Responsibility: Handle all database write operations with exponential backoff retry
 */

import type { StreamSessionState } from '../types/state'
import type { StorageAdapter } from '../adapters/storage-adapter'

export interface BasePayload {
  streamId: string
  sequence: number
  conversationId: string
}

export interface CommitHandler<T extends BasePayload> {
  commit(
    state: StreamSessionState<T>,
    payload: T,
    projectId: string,
  ): Promise<void>
  commitWithRetry(
    state: StreamSessionState<T>,
    payload: T,
    projectId: string,
    maxRetries?: number,
  ): Promise<boolean>
}

export function createCommitHandler<T extends BasePayload>(
  storageAdapter: StorageAdapter<T>,
): CommitHandler<T> {
  /**
   * Single commit attempt
   */
  async function commit(
    state: StreamSessionState<T>,
    payload: T,
    projectId: string,
  ): Promise<void> {
    await storageAdapter.commit(state, payload, projectId)
  }

  /**
   * Commit with exponential backoff retry
   * Returns true if succeeded, false if all retries failed
   */
  async function commitWithRetry(
    state: StreamSessionState<T>,
    payload: T,
    projectId: string,
    maxRetries = 3,
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await commit(state, payload, projectId)

        if (attempt > 1) {
          console.debug(
            `[CommitHandler] ✅ Succeeded on attempt ${attempt} for seq ${payload.sequence}`,
          )
        }

        return true
      } catch (e) {
        console.warn(
          `[CommitHandler] Attempt ${attempt}/${maxRetries} failed for seq ${payload.sequence}:`,
          e,
        )

        if (attempt < maxRetries) {
          // Exponential backoff: 100ms, 200ms, 400ms
          const delay = 100 * Math.pow(2, attempt - 1)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    return false
  }

  return {
    commit,
    commitWithRetry,
  }
}
