import type { AckMessagePayload } from '@/shared/ws/protocol'
import type { AckMessageEvent } from '@/shared/contracts/chat/downstream'
import type { ChatEventHandlerContext } from '../../model'
import { registerHandler } from '@/shared/ws/event-bus'
import { resequencer } from '@/entities/chat-session'
import { db } from '@/shared/lib/db'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:ack')

/**
 * Handle: chat:ack-message
 * Role: Fast-Track Sequencer
 * Logic:
 * 1. Receive ACK with StreamID.
 * 2. Lookup original content in Outbox (Optimistic Data).
 * 3. Construct synthetic NewMessagePayload.
 * 4. Feed to Resequencer immediately (skip Broadcast wait).
 */
export function registerAckMessageHandler(context: ChatEventHandlerContext) {
  return registerHandler<AckMessageEvent>('chat:ack-message', async (event) => {
    const payload = event.payload as AckMessagePayload

    // Validate StreamID and sequence presence for Fast Path
    if (!payload.streamId || !payload.sequence || payload.status !== 'sent') {
      // Just a status update (pending/failed), ignore for resequencing
      return
    }

    try {
      log.debug('Processing ACK for:', payload.dedupeId, payload.streamId)

      // 1. Retrieve Optimistic Data (Query by Index, not PK)
      const outboxItem = await db.outbox
        .where('dedupeId')
        .equals(payload.dedupeId)
        .first()

      // SAFETY: If Outbox item is missing, we cannot construct the full message.
      if (!outboxItem) {
        log.warn(
          'Outbox item missing. Aborting Fast Path for:',
          payload.dedupeId,
        )
        // Check if it was maybe already moved?
        return
      }

      log.debug('Found Outbox Item:', outboxItem)

      // 2. Resolve ProjectId
      const projectId =
        context.getProjectId() || outboxItem.projectId || 'FALLBACK_STUB'

      // 3. Construct Synthetic Payload
      // We assume the ACK means the server accepted it exactly as is.
      // We fuse the Authoritative ID (Server) with the Content (Local).
      const syntheticPayload = {
        messageId: payload.dedupeId, // Use dedupeId as messageId for local consistency
        streamId: payload.streamId,
        dedupeId: payload.dedupeId,
        conversationId: outboxItem.conversationId,
        // TODO: In the future, we should get the real current user ID from a Store/Context or save it in Outbox
        authorId: outboxItem.authorId || 'CURRENT_USER',
        content: outboxItem.payload.content,
        createdAt: new Date(outboxItem.createdAt).toISOString(),
        sequence: payload.sequence, // CRITICAL: Required for resequencer gap detection
      }

      log.debug('Fast-Tracking Message:', payload.streamId)

      // 4. Feed to Resequencer (The Gatekeeper)
      // We AWAIT this. If it fails (e.g. DB error), we do NOT delete from Outbox.
      await resequencer.processNewMessage(syntheticPayload, projectId)
      log.debug('Resequencer Processed Successfully')

      // 5. Atomic Cleanup
      // Only reached if Resequencer committed successfully.
      await db.outbox.where('dedupeId').equals(payload.dedupeId).delete()
      log.debug('Outbox Item Deleted')

      // TODO: Add Telemetry for "Fast Path Latency" (Date.now() - outboxItem.createdAt)
    } catch (error) {
      log.error('Failed to process ACK:', error)
      // We intentionally do NOT delete the Outbox item here.
      // An 'OutboxRetryWorker' should eventually pick this up or retry.
    }
  })
}
