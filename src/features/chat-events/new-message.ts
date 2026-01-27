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

    // INJECTION POINT:
    // We utilize the injected getter to stay FSD compliant (Feature cannot import App Store).
    const projectId = context.getProjectId() || 'FALLBACK_PROJECT_STUB'

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
