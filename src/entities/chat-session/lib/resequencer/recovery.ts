import { MAX_RECOVERY_ATTEMPTS } from './constants'
import type { ConversationState } from './types'
import { dispatchEvent } from '@/shared/ws/event-bus'

/**
 * Signals that recovery is needed for a conversation.
 */
export function triggerRecovery(state: ConversationState) {
  if (state.recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
    console.error(
      `[Resequencer] Max Recovery Attempts Exceeded for ${state.conversationId}`,
    )
    return
  }
  state.recoveryAttempts++

  // Use EventBus instead of window
  dispatchEvent({
    type: 'intent:recovery-requested',
    payload: {
      conversationId: state.conversationId,
      lastStreamId: state.expectedStreamId,
    },
  })
}
