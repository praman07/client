import type { SyncRequiredEvent } from '@/shared/contracts/chat/downstream'
import { ChatDownstreamEvent } from '@/shared/contracts/chat/events'
import { registerHandler } from '@/shared/ws/event-bus'
import { queryClient } from '@/shared/lib/tanstack-query/query-client'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:sync-required-handler')

export function registerSyncRequiredHandler() {
  return registerHandler<SyncRequiredEvent>(
    ChatDownstreamEvent.SyncRequired,
    async (event) => {
      const { conversationId, reason } = event.payload

      log.warn(
        `Force Sync Triggered. Reason: ${reason} (Conv: ${conversationId})`,
      )

      // Strategy: Invalidate Query Cache
      // This forces 'useHistoryLoader' (via 'use-fetch-delta') to refetch from the API.
      // The API (get-history) will return the latest gap-free data.
      await queryClient.invalidateQueries({
        queryKey: ['chat', conversationId],
        refetchType: 'active', // Only refetch if currently mounted (visible)
      })
    },
  )
}
