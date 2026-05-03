import type {
  NewMessageEvent,
  NewMessagePayload,
} from '@/shared/contracts/chat/downstream'
import type { ChatEventHandlerContext } from '../../model'
import { ChatDownstreamEvent } from '@/shared/contracts/chat/events'
import { registerHandler } from '@/shared/ws/event-bus'
import { resequencer } from '@/entities/chat-session'
import { db } from '@/shared/lib/db'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:handler')

/**
 * Handle: chat:new-message
 * Role: Coordinator
 * Logic: Delegate to Resequencer (The Brain)
 */
export function registerNewMessageHandler(context: ChatEventHandlerContext) {
  return registerHandler<NewMessageEvent>(
    ChatDownstreamEvent.NewMessage,
    async (event) => {
      const payload = event.payload as unknown as NewMessagePayload

      log.debug(
        `Received ${payload.meta?.replay ? 'Hot Replay' : 'Live'} message:`,
        {
          sequence: payload.sequence,
          conversationId: payload.conversationId,
          dedupeId: payload.dedupeId,
          isReplay: payload.meta?.replay,
        },
      )

      // INJECTION POINT & ROBUST RESOLUTION:
      // 1. Try Context (Fastest)
      let projectId = context.getProjectId()

      // INVARIANT: Skip if this is our own message (already processed via ACK)
      // This prevents double-processing which causes race conditions in resequencer
      if (payload.dedupeId) {
        const existing = await db.messages
          .where('dedupeId')
          .equals(payload.dedupeId)
          .first()

        if (existing) {
          const isReplay = payload.meta?.replay === true
          log.debug(
            `Skipping duplicate (${isReplay ? 'Hot Replay' : 'ACK path'} already committed):`,
            {
              dedupeId: payload.dedupeId,
              sequence: payload.sequence,
              isReplay,
            },
          )
          return
        }
      }

      // 2. Fallback: DB Lookup (If Context is missing/background tab)
      if (!projectId) {
        log.warn('Context missing ProjectID. Searching DB...')

        // Attempt 1: Check Conversation State (PK is Compound, so use Index)
        const state = await db.conversation_state
          .where('conversationId')
          .equals(payload.conversationId)
          .first()

        if (state?.projectId) {
          projectId = state.projectId
        } else {
          // Attempt 2: last resort - check any existing message
          const existingMsg = await db.messages
            .where('conversationId')
            .equals(payload.conversationId)
            .first()

          if (existingMsg?.projectId) {
            projectId = existingMsg.projectId
          }
        }
      }

      // 3. Hard Fail Protection
      if (!projectId) {
        log.error(
          `CRITICAL: Could not resolve ProjectID for Conversation ${payload.conversationId}. Dropping Message to prevent ghost data.`,
        )
        return
      }

      // Validation: Strict Invariant Check
      if (!payload.streamId) {
        log.error('Invalid payload: Missing streamId', payload)
        return
      }

      if (!context.getProjectId()) {
        log.warn(
          'No active project in store (Injected Context). Using Fallback Stub.',
        )
      }

      try {
        // 3. Hand-off to Resequencer
        await resequencer.processNewMessage(payload, projectId)

        // If this is a reply, increment the parent's replyCount in Dexie.
        // useLiveQuery on the parent row will re-render the badge automatically.
        // Fire-and-forget: a stale count is cosmetic, not correctness-critical.
        if (payload.parentMessageId) {
          db.messages
            .where('id')
            .equals(payload.parentMessageId)
            .modify((msg) => { msg.replyCount = (msg.replyCount ?? 0) + 1 })
            .catch(() => {})
        }

        // 4. Slow Path Outbox Cleanup (Redundancy)
        // If Fast Path (AckHandler) failed or was skipped (e.g. duplicate),
        // we double-check if we need to clean up the Outbox here.
        if (payload.dedupeId) {
          // Fire-and-forget cleanup to avoid blocking the critical path
          db.outbox
            .where('dedupeId')
            .equals(payload.dedupeId)
            .delete()
            .catch((err: any) => {
              log.warn('Failed to clean outbox:', err)
            })
        }
      } catch (error) {
        log.error('Failed to process new-message:', error)
      }
    },
  )
}
