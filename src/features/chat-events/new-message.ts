import type { NewMessageEvent } from '@/shared/contracts/chat/downstream'
import type { NewMessagePayload } from '@/shared/ws/protocol'
import { registerHandler } from '@/shared/ws/event-bus'
import { resequencer } from '@/entities/chat-session/lib/resequencer'
import { db } from '@/shared/lib/db'

export interface ChatEventHandlerContext {
  getProjectId: () => string | undefined
}

/**
 * Handle: chat:new-message
 * Role: Coordinator
 * Logic: Delegate to Resequencer (The Brain)
 */
export function registerNewMessageHandler(context: ChatEventHandlerContext) {
  return registerHandler<NewMessageEvent>('chat:new-message', async (event) => {
    const payload = event.payload as unknown as NewMessagePayload

    console.debug(
      `[NewMessage] Received ${payload.meta?.replay ? 'Hot Replay' : 'Live'} message:`,
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
        console.debug(
          `[NewMessage] Skipping duplicate (${isReplay ? 'Hot Replay' : 'ACK path'} already committed):`,
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
      console.warn('[ChatEvents] Context missing ProjectID. Searching DB...')

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
      console.error(
        `[ChatEvents] CRITICAL: Could not resolve ProjectID for Conversation ${payload.conversationId}. Dropping Message to prevent ghost data.`,
      )
      return
    }

    // Validation: Strict Invariant Check
    if (!payload.streamId) {
      console.error('[ChatEvents] Invalid payload: Missing streamId', payload)
      return
    }

    if (!context.getProjectId()) {
      console.warn(
        '[ChatEvents] No active project in store (Injected Context). Using Fallback Stub.',
      )
    }

    try {
      // 3. Hand-off to Resequencer
      await resequencer.processNewMessage(payload, projectId)

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
            console.warn('[NewMessageHandler] Failed to clean outbox:', err)
          })
      }
    } catch (error) {
      console.error('[ChatEvents] Failed to process new-message:', error)
    }
  })
}
