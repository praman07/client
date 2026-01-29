import { MAX_RECOVERY_ATTEMPTS } from './constants'
import type { ConversationState } from './types'
import { dispatchEvent } from '@/shared/ws/event-bus'
import { findOldestBufferedMessage } from './engine'

/**
 * Signals that recovery is needed for a conversation.
 * Calculates exact gap size from buffer state.
 */
export function triggerRecovery(state: ConversationState) {
  if (state.recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
    console.error(
      `[Resequencer] Max Recovery Attempts Exceeded for ${state.conversationId}`,
    )
    return
  }
  state.recoveryAttempts++

  // Calculate exact gap size from buffer
  const oldestBuffered = findOldestBufferedMessage(state.buffer)
  const targetSequence = oldestBuffered?.sequence ?? state.lastSequence + 1
  const gapSize = Math.max(0, targetSequence - state.lastSequence - 1)

  // Use EventBus instead of window
  dispatchEvent({
    type: 'intent:recovery-requested',
    payload: {
      conversationId: state.conversationId,
      projectId: state.projectId,
      lastStreamId: state.expectedStreamId,
      lastSequence: state.lastSequence ?? 0,
      gapSize, // Exact missing count
    },
  })
}
