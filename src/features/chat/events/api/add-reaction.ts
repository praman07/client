/**
 * Chat Events API: Reaction emitters
 */
import { ChatUpstreamEvent } from '@/shared/contracts/chat/events'
import { wsManager } from '@/shared/ws'

/**
 * Emits a add-reaction upstream event.
 * Returns tempId for tracking the server ACK.
 */
export function addReaction(messageId: string, emoji: string): string {
  const tempId = crypto.randomUUID()
  wsManager.emit(ChatUpstreamEvent.AddReaction, { messageId, emoji, tempId })
  return tempId
}

/**
 * Emits a remove-reaction upstream event.
 * Returns tempId for tracking the server ACK.
 */
export function removeReaction(messageId: string, emoji: string): string {
  const tempId = crypto.randomUUID()
  wsManager.emit(ChatUpstreamEvent.RemoveReaction, { messageId, emoji, tempId })
  return tempId
}
