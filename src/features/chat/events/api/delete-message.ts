import { ChatUpstreamEvent } from '@/shared/contracts/chat/upstream'
import { wsManager } from '@/shared/ws'

/**
 * Emits a chat:delete-message event over WebSocket.
 *
 * Soft-delete only — the server sets deletedAt, preserving the row.
 * No optimistic update: the UI only changes when the server broadcasts
 * 'chat:message-deleted' to all clients. This prevents ghost tombstones
 * if the delete is rejected (e.g. already deleted, RBAC failure).
 *
 * @param messageId - ID of the message to delete
 * @param nonce     - Idempotency token; use crypto.randomUUID() per attempt
 */
export function deleteMessage(messageId: string, nonce: string): void {
  wsManager.emit(ChatUpstreamEvent.DeleteMessage, {
    messageId,
    nonce,
  })
}
