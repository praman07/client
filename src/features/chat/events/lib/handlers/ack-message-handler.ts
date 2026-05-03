import type { AckMessageEvent } from '@/shared/contracts/chat/downstream'
import type { ChatEventHandlerContext } from '../../model'
import { ChatDownstreamEvent } from '@/shared/contracts/chat/events'
import { registerHandler } from '@/shared/ws/event-bus'
import { resequencer } from '@/entities/chat-session'
import { db } from '@/shared/lib/db'
import { createLogger } from '@/shared/lib/logger'
import { downloadUrlKeys } from '@/features/chat/media'
import { queryClient } from '@/shared/lib/tanstack-query/query-client'

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
  return registerHandler<AckMessageEvent>(
    ChatDownstreamEvent.AckMessage,
    async (event) => {
      const payload = event.payload

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
          parentMessageId: outboxItem.payload.parentMessageId,
          // ── Media: carry metadata so attachments appear in the sender's chat view
          metadata: outboxItem.payload.metadata,
        }

        // 3.5 Prime React Query download-url cache for each live attachment URL.
        // The sender has the live URL from the upload result (stored in outbox payload).
        // Priming here means useDownloadUrl(fileId) finds 'initialData' immediately
        // and skips the GQL round-trip, giving instant image render.
        const attachments = outboxItem.payload.metadata?.attachments ?? []
        if (attachments.length > 0) {
          const FIFTY_FIVE_MIN = 55 * 60 * 1000
          attachments.forEach(({ fileId, url }) => {
            if (url) {
              // Set the live URL as query data so useDownloadUrl renders
              // instantly for the sender without a GQL round-trip.
              queryClient.setQueryData(
                downloadUrlKeys.file(fileId),
                url,
                { updatedAt: Date.now() + FIFTY_FIVE_MIN },
              )
            }
          })
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
    },
  )
}
