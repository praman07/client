import { commitMessage } from './storage'
import { triggerRecovery } from './recovery'
import { BUFFER_LIMIT, GAP_TIMEOUT_MS } from './constants'
import type { ConversationState } from './types'
import type { NewMessagePayload } from '@/shared/ws/protocol'

/**
 * Scan for oldest message in buffer.
 * O(N) scan.
 */
export function findOldestBufferedMessage(
  buffer: Map<string, NewMessagePayload>,
): NewMessagePayload | null {
  let oldest: NewMessagePayload | null = null

  for (const msg of buffer.values()) {
    if (!oldest) {
      oldest = msg
      continue
    }
    if (msg.sequence < oldest.sequence) {
      oldest = msg
    }
  }
  return oldest
}

/**
 * Flushes the buffer by finding the oldest message > expectedStreamId.
 */
/**
 * Flushes the buffer by finding the oldest message strictly next in sequence.
 */
export async function flushBuffer(
  state: ConversationState,
  projectId: string,
  strategy: 'strict' | 'force' = 'force',
) {
  if (state.buffer.size === 0) return

  while (state.buffer.size > 0) {
    const oldest = findOldestBufferedMessage(state.buffer)
    if (!oldest) break

    // 1. Check for Duplicate/Old (Guard against race conditions)
    if (oldest.sequence <= state.lastSequence) {
      state.buffer.delete(oldest.streamId)
      continue
    }

    // 2. Check Strategy
    if (strategy === 'strict') {
      const isNext = oldest.sequence === state.lastSequence + 1
      if (!isNext) {
        // Gap Detected: Stop flushing, wait for gap to fill or timeout
        break
      }
    }
    // If 'force', we skip the gap check (used on timeout)

    // 3. Commit
    try {
      await commitMessage(state, oldest, projectId)
      state.buffer.delete(oldest.streamId)

      console.debug(`[Resequencer] Committed from Buffer: ${oldest.sequence}`)

      // Reset recovery attempts if we are syncing successfully
      state.recoveryAttempts = 0
      state.status = 'SYNCED'
    } catch (e) {
      console.error('[Resequencer] Flush commit failed', e)
      break // Stop flush on DB error
    }
  }

  // If buffer cleared, clear timer
  if (state.buffer.size === 0) {
    if (state.gapTimer) {
      clearTimeout(state.gapTimer)
      state.gapTimer = null
    }
  }
}

/**
 * Handles buffer overflow by clearing buffer and triggering recovery.
 */
export function handleBufferOverflow(state: ConversationState) {
  console.error(`[Resequencer] Buffer Limit Exceeded (${state.buffer.size})`)
  state.buffer.clear()
  state.status = 'DESYNCED'
  triggerRecovery(state)
}

/**
 * Handles the gap timeout (waited long enough for missing message).
 */
export async function onGapTimeout(
  state: ConversationState,
  projectId: string,
) {
  state.gapTimer = null
  // Timeout reached: We assume the buffer contains the best we have.
  // Attempt to flush.
  await flushBuffer(state, projectId, 'force')
}

/**
 * Internal message processing logic.
 */
export async function processMessageInternal(
  state: ConversationState,
  payload: NewMessagePayload,
  projectId: string,
) {
  // 1. Deduplication (Sequence Based)
  // If we have seen this sequence (or higher), it's old or duplicate.
  // Note: We blindly believe sequence numbers from server as truth.
  if (payload.sequence <= state.lastSequence) {
    console.debug(
      `[Resequencer] Dropping Duplicate/Old: ${payload.sequence} (Head: ${state.lastSequence})`,
    )
    return
  }

  // 2. Exact Match (Strict Ordering)
  const isStrictNext = payload.sequence === state.lastSequence + 1

  if (isStrictNext) {
    console.debug(
      `[Resequencer] Strict Sequence Detected: ${payload.sequence}. Committing immediately.`,
    )
    try {
      await commitMessage(state, payload, projectId)
      // Opportunistic Flush
      await flushBuffer(state, projectId, 'strict')
      return
    } catch (e) {
      console.error('[Resequencer] Strict Commit Failed', e)
      return
    }
  }

  // FALLBACK: Buffer (Gap or Timestamp Jump)
  state.buffer.set(payload.streamId, payload)
  console.debug(
    `[Resequencer] Buffered: ${payload.streamId}. Buffer Size: ${state.buffer.size}`,
  )

  // Safety: Check Buffer Limit
  if (state.buffer.size >= BUFFER_LIMIT) {
    handleBufferOverflow(state)
    return
  }

  if (!state.gapTimer) {
    state.gapTimer = setTimeout(() => {
      console.debug(`[Resequencer] Gap Timer Fired for ${state.conversationId}`)
      onGapTimeout(state, projectId)
    }, GAP_TIMEOUT_MS)
  }
}
