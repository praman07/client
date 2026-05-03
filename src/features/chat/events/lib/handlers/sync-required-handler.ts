/**
 * Handle: chat:sync-required
 *
 * Fired by the server when the client's message sequence gap cannot be filled
 * by the Redis Stream hot-replay (stream truncated, gap too large, etc.).
 *
 * Recovery strategy:
 *   1. Read the current lastSequence from the resequencer for this conversation.
 *   2. Dispatch intent:recovery-requested → RecoveryListener → fetchDelta
 *      (GraphQL messagesDelta) → processRecoveryBatch → Dexie commit.
 *
 * Previously this handler only called queryClient.invalidateQueries which
 * had no effect: refetchType:'active' silently skips when the query is not
 * mounted, and the history query key is unrelated to gap recovery.
 *
 * The recovery path (intent:recovery-requested → RecoveryListener) is the
 * same path the resequencer's gap-detector uses for real-time gaps, giving us
 * sequence-accurate, Dexie-committed recovery for offline gaps too.
 */

import type { SyncRequiredEvent } from '@/shared/contracts/chat/downstream'
import type { ChatEventHandlerContext } from '../../model'
import { ChatDownstreamEvent } from '@/shared/contracts/chat/events'
import { dispatchEvent, registerHandler } from '@/shared/ws/event-bus'
import { resequencer } from '@/entities/chat-session'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:sync-required-handler')

export function registerSyncRequiredHandler(context: ChatEventHandlerContext) {
  return registerHandler<SyncRequiredEvent>(
    ChatDownstreamEvent.SyncRequired,
    async (event) => {
      const { conversationId, reason } = event.payload

      log.warn(`Force Sync Triggered. Reason: ${reason} (Conv: ${conversationId})`)

      const projectId = context.getProjectId() ?? null

      if (!projectId) {
        // Cannot commit to Dexie without a projectId — RecoveryListener will skip.
        // This can happen if the user navigated away. Safe to no-op.
        log.debug('No projectId available, skipping recovery dispatch', { conversationId })
        return
      }

      // Get the cursor the client just sent on subscribe — this is the
      // sequence the server said we're behind from.
      const subscriptionState = await resequencer.getSubscriptionState(
        conversationId,
      )

      const lastSequence = subscriptionState.lastSequence

      log.debug('Dispatching recovery request', {
        conversationId,
        projectId,
        lastSequence,
        reason,
      })

      // Dispatch → RecoveryListener (mounted in the chat route) →
      // useFetchDelta → GraphQL messagesDelta → processRecoveryBatch → Dexie.
      dispatchEvent({
        type: 'intent:recovery-requested',
        payload: {
          conversationId,
          projectId,
          lastStreamId: subscriptionState.epoch ?? null,
          lastSequence,
          // gapSize: unknown at this point, use 50 as a safe ceiling.
          // RecoveryListener caps at Math.min(gapSize + 10, 100).
          gapSize: 50,
        },
      })
    },
  )
}
