/**
 * BUFFER MANAGER: Buffer operations and flushing
 *
 * Responsibility: Manage message buffer, flushing, and overflow detection
 */

import { compareStreamId } from '../utils/stream-id'
import type { StreamSessionState } from '../types/state'
import type { BasePayload, CommitHandler } from './commit-handler'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('reseq:buffer')

export type FlushStrategy = 'strict' | 'force'

export interface BufferManager<T extends BasePayload> {
  add: (state: StreamSessionState<T>, message: T) => void
  flush: (
    state: StreamSessionState<T>,
    projectId: string,
    strategy: FlushStrategy,
  ) => Promise<void>
  findOldest: (buffer: Map<string, T>) => T | null
  checkOverflow: (state: StreamSessionState<T>, maxSize: number) => boolean
}

export function createBufferManager<T extends BasePayload>(
  commitHandler: CommitHandler<T>,
): BufferManager<T> {
  /**
   * Add message to buffer
   */
  function add(state: StreamSessionState<T>, message: T): void {
    state.buffer.set(message.streamId, message)
  }

  /**
   * Find oldest message in buffer by streamId
   */
  function findOldest(buffer: Map<string, T>): T | null {
    let oldest: T | null = null

    for (const msg of buffer.values()) {
      if (!oldest) {
        oldest = msg
        continue
      }

      if (compareStreamId(msg.streamId, oldest.streamId) < 0) {
        oldest = msg
      }
    }

    return oldest
  }

  /**
   * Flush buffer using specified strategy
   */
  async function flush(
    state: StreamSessionState<T>,
    projectId: string,
    strategy: FlushStrategy,
  ): Promise<void> {
    if (state.buffer.size === 0) return

    while (state.buffer.size > 0) {
      const oldest = findOldest(state.buffer)
      if (!oldest) break

      // Skip if duplicate/old
      if (
        state.lastStreamIdSeen &&
        compareStreamId(oldest.streamId, state.lastStreamIdSeen) <= 0
      ) {
        state.buffer.delete(oldest.streamId)
        continue
      }

      // Strict mode: only flush strict next sequence
      if (strategy === 'strict') {
        const isNext = oldest.sequence === state.lastSequence + 1
        if (!isNext) break
      }

      // Commit
      try {
        await commitHandler.commit(state, oldest, projectId)
        state.buffer.delete(oldest.streamId)

        log.debug(`Flushed: ${oldest.sequence} / ${oldest.streamId}`)

        state.recoveryAttempts = 0
        state.status = 'SYNCED'
      } catch (e) {
        log.error('Flush failed:', e)
        break
      }
    }

    // Clear timer if buffer empty
    if (state.buffer.size === 0 && state.gapTimer) {
      clearTimeout(state.gapTimer)
      state.gapTimer = null
    }
  }

  /**
   * Check if buffer exceeds max size
   */
  function checkOverflow(
    state: StreamSessionState<T>,
    maxSize: number,
  ): boolean {
    return state.buffer.size >= maxSize
  }

  return {
    add,
    flush,
    findOldest,
    checkOverflow,
  }
}
