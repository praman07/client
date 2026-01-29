import type { SyncRequiredEvent } from '@/shared/contracts/chat/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { queryClient } from '@/shared/lib/tanstack-query/query-client'

export function registerSyncRequiredHandler() {
  return registerHandler<SyncRequiredEvent>(
    'chat:sync-required',
    async (event) => {
      const { conversationId, reason } = event.payload

      console.warn(
        `[SyncRequired] Force Sync Triggered. Reason: ${reason} (Conv: ${conversationId})`,
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
