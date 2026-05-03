/**
 * Handler: system.subscription.expiring
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { SystemSubscriptionExpiringContract, SystemSubscriptionExpiringPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerSystemSubscriptionExpiringHandler(context: NotificationEventHandlerContext) {
  return registerHandler<SystemSubscriptionExpiringContract>(
    NotificationDownstreamEvent.SystemSubscriptionExpiring,
    (event) => {
      const payload = event.payload as unknown as SystemSubscriptionExpiringPayload
      context.dispatch(addNotification({
        id: `subscription-expiring-${payload.workspaceId}`,
        type: NotificationDownstreamEvent.SystemSubscriptionExpiring,
        title: `${payload.workspaceName} subscription expiring`,
        body: `${payload.daysRemaining} days remaining`,
        read: false,
        createdAt: new Date().toISOString(),
        metadata: { workspaceId: payload.workspaceId, expiresAt: payload.expiresAt },
      }))
    },
  )
}
