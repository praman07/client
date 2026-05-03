import { ChatUpstreamEvent } from '@/shared/contracts/chat/upstream'
import { wsManager } from '@/shared/ws'

/**
 * Emits a chat:edit-message event over WebSocket.
 *
 * The server handler validates ownership (authorId === userId), idempotency
 * (nonce dedup via MessageEditOutbox), and content hash (SHA-256 no-op guard).
 *
 * No optimistic update is applied — the edit appears after the server broadcasts
 * 'chat:message-edited' back to all clients (~50-200ms). This is intentional:
 * avoids desync when the server rejects the edit (e.g., concurrent delete).
 *
 * @param messageId - ID of the message to edit
 * @param content   - New text content (caller must validate non-empty)
 * @param nonce     - Unique idempotency token; use crypto.randomUUID()
 */
export function editMessage(
  messageId: string,
  content: string,
  nonce: string,
): void {
  const trimmed = content.trim()
  if (!trimmed) return // Never send empty edits

  wsManager.emit(ChatUpstreamEvent.EditMessage, {
    messageId,
    content: trimmed,
    nonce,
  })
}
