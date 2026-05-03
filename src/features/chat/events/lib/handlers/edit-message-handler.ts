import type { MessageEditedEvent } from '@/shared/contracts/chat/downstream'
import { ChatDownstreamEvent } from '@/shared/contracts/chat/events'
import { registerHandler } from '@/shared/ws/event-bus'
import { db } from '@/shared/lib/db'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:edit-handler')

/**
 * Handle: chat:message-edited
 *
 * Applies an incoming edit event from the server by surgically patching the
 * target message in Dexie IndexedDB. Dexie's useLiveQuery auto-triggers
 * re-renders in any component observing this message — no manual React Query
 * invalidation or Redux dispatch is needed.
 *
 * Out-of-order guard: If two edits arrive late/out-of-order (e.g., due to
 * PubSub reordering on reconnect), we compare editedAt timestamps and discard
 * stale events. This prevents earlier edits from overwriting later ones.
 *
 * Called for ALL clients including the original sender — no optimistic update
 * is applied on the sender side. Every client converges via this single path.
 */
export function registerEditMessageHandler() {
  return registerHandler<MessageEditedEvent>(
    ChatDownstreamEvent.MessageEdited,
    async (event) => {
      const { messageId, conversationId, content, editedAt } =
        event.payload as unknown as {
          messageId: string
          conversationId: string
          content: string
          editedAt: string
          authorId: string
        }

      log.debug('Received chat:message-edited', { messageId, conversationId })

      try {
        // NOTE: The messages store primary key is [projectId+conversationId+streamId].
        // The 'id' field is NOT a secondary index — .where('id') throws SchemaError.
        // 'dedupeId' IS indexed and holds the same server-assigned message UUID as 'id'
        // (set in storage.ts: id: payload.messageId, dedupeId: payload.messageId).
        const updated = await db.messages
          .where('dedupeId')
          .equals(messageId)
          .modify((msg) => {
            // Out-of-order guard: skip if this edit is older than what we already have.
            // This handles PubSub reordering on reconnect (two edits in quick succession
            // may arrive in wrong order at a reconnecting client).
            if (msg.editedAt && new Date(editedAt) <= new Date(msg.editedAt)) {
              log.debug('Skipping stale edit event', {
                messageId,
                incomingEditedAt: editedAt,
                currentEditedAt: msg.editedAt,
              })
              return
            }

            msg.content = content
            msg.editedAt = editedAt
            msg.isEdited = true
          })

        if (updated === 0) {
          // Message not in local cache (e.g. old history not yet loaded, or a
          // different device session that doesn't have this message in its window).
          // Safe to ignore — next history load will fetch the updated content from server.
          log.warn('Edit target not in local cache. Skipping.', {
            messageId,
            conversationId,
          })
          return
        }

        log.debug('Message patched in IndexedDB', { messageId, editedAt })
      } catch (error) {
        log.error('Failed to apply message edit to IndexedDB', {
          error,
          messageId,
        })
      }
    },
  )
}
