/**
 * Handler: vault.storage.limit
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { VaultStorageLimitContract, VaultStorageLimitPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerVaultStorageLimitHandler(context: NotificationEventHandlerContext) {
  return registerHandler<VaultStorageLimitContract>(
    NotificationDownstreamEvent.VaultStorageLimit,
    (event) => {
      const payload = event.payload as unknown as VaultStorageLimitPayload
      context.dispatch(addNotification({
        id: `vault-limit-${payload.workspaceId}`,
        type: NotificationDownstreamEvent.VaultStorageLimit,
        title: `${payload.workspaceName} storage full`,
        body: `${payload.currentUsage} / ${payload.limit}`,
        read: false,
        createdAt: new Date().toISOString(),
        metadata: { workspaceId: payload.workspaceId },
      }))
    },
  )
}
