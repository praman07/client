import { commitMessage } from './storage'
import { triggerRecovery } from './recovery'
import {
  BUFFER_LIMIT,
  GAP_TIMEOUT_MS,
  MAX_RECOVERY_ATTEMPTS,
  RECOVERY_TIMEOUT_MS,
  FAST_FORWARD_THRESHOLD,
} from './constants'
import { compareStreamId } from './stream-id'
import type { ConversationState } from './types'
import type { NewMessagePayload } from '@/shared/ws/protocol'

/**
 * Validates that payload has all required fields for DB write.
 * CRITICAL: Prevents cursor advancement when payload is incomplete.
 */
function validatePayload(payload: NewMessagePayload): boolean {
  return !!(
    payload.messageId &&
    payload.streamId &&
    payload.conversationId &&
    payload.authorId &&
    payload.content && // CRITICAL: content must exist
    payload.createdAt &&
    typeof payload.sequence === 'number'
  )
}

/**
 * Commits message with retry logic (exponential backoff).
 * Returns true if commit succeeded, false if all retries failed.
 */
async function commitWithRetry(
  state: ConversationState,
  payload: NewMessagePayload,
  projectId: string,
  maxRetries = 3,
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await commitMessage(state, payload, projectId)
      if (attempt > 1) {
        console.debug(
          `[Resequencer] ✅ Commit succeeded on attempt ${attempt} for seq ${payload.sequence}`,
        )
      }
      return true
    } catch (e) {
      console.warn(
        `[Resequencer] Commit attempt ${attempt}/${maxRetries} failed for seq ${payload.sequence}:`,
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

/**
 * Scan for oldest message in buffer (Based on Stream ID).
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
    // Hybrid: Sort by Stream ID (Truth for ordering)
    if (compareStreamId(msg.streamId, oldest.streamId) < 0) {
      oldest = msg
    }
  }
  return oldest
}

/**
 * Flushes the buffer by finding the oldest message based on StreamID.
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

    // 1. Check for Duplicate/Old (StreamID Lexical Check)
    // Hybrid: Deduplication uses Stream ID
    if (
      state.lastStreamIdSeen &&
      compareStreamId(oldest.streamId, state.lastStreamIdSeen) <= 0
    ) {
      state.buffer.delete(oldest.streamId)
      continue
    }

    // 2. Check Strategy
    if (strategy === 'strict') {
      // Hybrid: Gap Detection uses Sequence (Integer Check)
      const isNext = oldest.sequence === state.lastSequence + 1
      if (!isNext) {
        // Gap Detected via Sequence!
        // Even if StreamID is correct, missing sequence implies missing data.
        break
      }
    }

    // 3. Commit
    try {
      await commitMessage(state, oldest, projectId)
      state.buffer.delete(oldest.streamId)

      console.debug(
        `[Resequencer] Committed from Buffer: ${oldest.sequence} / ${oldest.streamId}`,
      )

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

  // If buffer is empty, we don't need to do anything
  if (state.buffer.size === 0) return

  // Fast-Forward Strategy: Skip incremental recovery for large gaps
  const oldest = findOldestBufferedMessage(state.buffer)
  if (oldest) {
    const gapSize = oldest.sequence - state.lastSequence - 1
    if (gapSize > FAST_FORWARD_THRESHOLD) {
      console.warn(
        `[Resequencer] Large gap detected (${gapSize}). Fast-forwarding to avoid recovery loops.`,
      )
      await flushBuffer(state, projectId, 'force')
      state.status = 'SYNCED'
      state.recoveryAttempts = 0
      return
    }
  }

  if (state.recoveryAttempts < MAX_RECOVERY_ATTEMPTS) {
    console.warn(
      `[Resequencer] Gap detected. Triggering Recovery (Attempt ${state.recoveryAttempts + 1}/${MAX_RECOVERY_ATTEMPTS})`,
    )
    state.status = 'RECOVERING'
    triggerRecovery(state)

    // Re-schedule check (Wait for network response)
    state.gapTimer = setTimeout(() => {
      onGapTimeout(state, projectId)
    }, RECOVERY_TIMEOUT_MS)
  } else {
    // Timeout reached & Max attempts exhausted.
    // Assume forever gap (corruption). Force flush.
    console.error(
      '[Resequencer] Recovery Failed (Max Attempts). Force Flushing buffer.',
    )
    await flushBuffer(state, projectId, 'force')
  }
}

/**
 * Internal message processing logic.
 */
export async function processMessageInternal(
  state: ConversationState,
  payload: NewMessagePayload,
  projectId: string,
  isReplay: boolean = false,
) {
  // 0. Server Reset Detection (Auto-Heal)
  // If we receive Sequence 1 but we are way ahead, it means the server was reset.
  if (payload.sequence === 1 && state.lastSequence > 1) {
    console.warn(
      `[Resequencer] Server Reset Detected! Local: ${state.lastSequence} -> Remote: 1. Resetting State.`,
    )
    state.lastSequence = 0
    state.lastStreamIdSeen = '0-0'
    state.buffer.clear()
    state.status = 'SYNCED'
  }

  // 1. Deduplication (StreamID Based)
  if (
    state.lastStreamIdSeen &&
    compareStreamId(payload.streamId, state.lastStreamIdSeen) <= 0
  ) {
    console.debug(
      `[Resequencer] Dropping Duplicate/Old: ${payload.streamId} (Head: ${state.lastStreamIdSeen})`,
    )
    return
  }

  // 2. Exact Match (Strict Ordering - Check Sequence for Gaps, but commit if strictly next)
  // Hybrid: We still check strictly next sequence for fast path commit
  const isStrictNext = payload.sequence === state.lastSequence + 1

  if (isStrictNext) {
    // STEP 1: Validate payload completeness
    const isPayloadValid = validatePayload(payload)

    console.debug(
      `[Resequencer] Strict Sequence Detected: ${payload.sequence}`,
      {
        lastSequence: state.lastSequence,
        gap: payload.sequence - state.lastSequence,
        payloadValid: isPayloadValid,
        status: state.status,
      },
    )

    if (!isPayloadValid) {
      console.error(
        `[Resequencer] ❌ Strict sequence ${payload.sequence} has incomplete payload!`,
        { payload },
      )
      // Don't commit incomplete payload - buffer it
      state.buffer.set(payload.streamId, payload)
      return
    }

    // STEP 2: Attempt DB commit with retry
    console.debug(
      `[Resequencer] Payload valid. Committing sequence ${payload.sequence}...`,
    )

    const success = await commitWithRetry(state, payload, projectId)

    if (success) {
      console.debug(
        `[Resequencer] ✅ Committed sequence ${payload.sequence} to DB`,
      )
      // STEP 3: Opportunistic flush
      await flushBuffer(state, projectId, 'strict')
      return
    } else {
      // All retries failed - trigger recovery
      console.error(
        `[Resequencer] ❌ All commit retries failed for seq ${payload.sequence}. Triggering recovery.`,
      )
      state.buffer.set(payload.streamId, payload)
      state.status = 'RECOVERING'
      triggerRecovery(state)
      return
    }
  }

  // INVARIANT: Replay messages validate sequence but don't trigger recovery
  // Strategy: Wait 50ms for small gaps (network jitter), buffer on mismatch
  if (isReplay) {
    const gap = payload.sequence - state.lastSequence
    const isStrictNextReplay = gap === 1

    if (isStrictNextReplay) {
      // Validate payload even for replay
      if (!validatePayload(payload)) {
        console.error(
          `[Resequencer] ❌ Replay message ${payload.sequence} has incomplete payload!`,
        )
        state.buffer.set(payload.streamId, payload)
        return
      }

      console.debug(
        `[Resequencer] Replay message (strict next). Committing sequence ${payload.sequence}.`,
      )

      const success = await commitWithRetry(state, payload, projectId)

      if (success) {
        await flushBuffer(state, projectId, 'strict')
        return
      } else {
        console.error(
          `[Resequencer] ❌ Replay commit failed after retries for seq ${payload.sequence}`,
        )
        state.buffer.set(payload.streamId, payload)
        return
      }
    }

    // Gap detected in replay - DON'T force commit
    console.warn(
      `[Resequencer] Replay gap detected! Expected ${state.lastSequence + 1}, got ${payload.sequence} (gap: ${gap - 1})`,
    )

    // Buffer the message (don't commit with gaps)
    state.buffer.set(payload.streamId, payload)

    // Small gap (< 10): Wait 50ms for WebSocket to deliver missing messages
    // Large gap (>= 10): Don't wait, buffer will trigger recovery on timeout
    if (gap > 1 && gap < 10) {
      console.debug(
        `[Resequencer] Small gap (${gap - 1}). Waiting 50ms for WebSocket delivery...`,
      )
      // Don't set gap timer here - replay shouldn't trigger recovery
      // Just buffer and wait for next message
    }

    return
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
