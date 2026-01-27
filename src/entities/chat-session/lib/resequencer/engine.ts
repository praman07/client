import { compareStreamId, isStrictlyNextStreamId } from './stream-id'
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
    if (compareStreamId(msg.streamId, oldest.streamId) < 0) {
      oldest = msg
    }
  }
  return oldest
}

/**
 * Flushes the buffer by finding the oldest message > expectedStreamId.
 */
export async function flushBuffer(
  state: ConversationState,
  projectId: string,
  strategy: 'strict' | 'force' = 'force',
) {
  if (state.buffer.size === 0) return

  while (state.buffer.size > 0) {
    if (!state.expectedStreamId) break

    const oldest = findOldestBufferedMessage(state.buffer)
    if (!oldest) break

    const comparison = compareStreamId(oldest.streamId, state.expectedStreamId)

    // If oldest is older/equal to expected (Duplicate), discard
    if (comparison <= 0) {
      state.buffer.delete(oldest.streamId)
      continue
    }

    // Check Strategy
    if (strategy === 'strict') {
      const isNext = isStrictlyNextStreamId(
        state.expectedStreamId,
        oldest.streamId,
      )
      if (!isNext) {
        // Stop flushing, wait for gap to fill or timeout
        break
      }
    }

    // If we are here, we commit (either strictly next, or forcing gap)
    try {
      await commitMessage(state, oldest, projectId)
      state.buffer.delete(oldest.streamId)

      console.debug(`[Resequencer] Committed: ${oldest.streamId}`)

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
  // Cold Start Safety
  if (state.expectedStreamId === null) {
    console.warn(`[Resequencer] Cold Start. Buffering & Requesting Sync.`)
    state.buffer.set(payload.streamId, payload)
    state.status = 'DESYNCED'
    triggerRecovery(state)
    return
  }

  const comparison = compareStreamId(payload.streamId, state.expectedStreamId)

  // Debug Log: Entry
  console.debug(
    `[Resequencer] Processing ${payload.streamId} (Expected: > ${state.expectedStreamId})`,
  )

  // 1. Deduplication
  if (comparison < 0) {
    console.debug(`[Resequencer] Dropping Duplicate: ${payload.streamId}`)
    return
  }

  // 2. Exact Match (Strict Ordering)
  if (comparison === 0) {
    console.debug(`[Resequencer] Dropping Exact Match: ${payload.streamId}`)
    return
  }

  // 3. New Message Handling

  // OPTIMIZATION: Check for Strict Sequence
  // If this message is EXACTLY the next one (same timestamp, seq+1), we commit immediately.
  // This avoids latency for the happy path.
  const isStrictNext = isStrictlyNextStreamId(
    state.expectedStreamId,
    payload.streamId,
  )

  if (isStrictNext) {
    console.debug(
      `[Resequencer] Strict Sequence Detected: ${payload.streamId}. Committing immediately.`,
    )
    try {
      await commitMessage(state, payload, projectId)
      // After strict commit, we might have bridged a gap and can flush buffer!
      // Opportunistic Flush: Only flush if strictly next
      await flushBuffer(state, projectId, 'strict')
      return
    } catch (e) {
      console.error('[Resequencer] Strict Commit Failed', e)
      // Fallback to buffering if commit fails?
      // No, if commit fails, we are likely in trouble (DB error).
      // We should probably throw or let it retry via recovery.
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
