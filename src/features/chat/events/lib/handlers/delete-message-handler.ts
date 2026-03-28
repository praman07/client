/**
 * Handle: chat:message-deleted
 *
 * Applies a soft-delete tombstone to the local IndexedDB message row.
 *
 * Design decisions:
 * - Row is KEPT in Dexie (not removed). This preserves correct ordering in the
 *   message list and lets the tombstone UI render "This message was deleted"
 *   in the right position.
 * - content is zeroed out locally for privacy (so deleted text is not persisted
 *   in the browser's IndexedDB after deletion).
 * - deletedBy is NOT stored locally — it lives only in MessageDeleteOutbox
 *   (server-side audit table). The client only knows the message is deleted,
 *   not who deleted it.
 * - Dexie useLiveQuery automatically triggers UI re-render on modify() — no
 *   manual React Query invalidation or Redux dispatch needed.
 */

import type { MessageDeletedEvent } from '@/shared/contracts/chat/downstream'
import { ChatDownstreamEvent } from '@/shared/contracts/chat/events'
import { registerHandler } from '@/shared/ws/event-bus'
import { db } from '@/shared/lib/db'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:delete-handler')

export function registerDeleteMessageHandler() {
  return registerHandler<MessageDeletedEvent>(
    ChatDownstreamEvent.MessageDeleted,
    async (event) => {
      const { messageId, conversationId, deletedAt } = event.payload

      log.debug('Received chat:message-deleted', { messageId, conversationId })

      try {
        // NOTE: The messages store primary key is [projectId+conversationId+streamId].
        // 'id' is NOT a secondary index — .where('id') throws SchemaError.
        // 'dedupeId' IS indexed (schema v3) and holds the same UUID as 'id'.
        const updated = await db.messages
          .where('dedupeId')
          .equals(messageId)
          .modify((msg) => {
            msg.deletedAt = deletedAt
            // Zero out content locally for privacy.
            // The tombstone UI reads deletedAt to show "This message was deleted".
            msg.content = '' as unknown as typeof msg.content
          })

        if (updated === 0) {
          // Message not in local cache (old message, different device session).
          // Safe to skip — next history load fetches the tombstone from the server.
          log.debug('Delete target not in local cache, skipping', { messageId })
          return
        }

        log.debug('Message soft-deleted in IndexedDB', { messageId, updated })
      } catch (error) {
        log.error('Failed to apply delete to IndexedDB', { error, messageId })
      }
    },
  )
}
