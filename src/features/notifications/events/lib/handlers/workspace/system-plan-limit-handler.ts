/**
 * Handler: system.plan.limit
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { SystemPlanLimitContract, SystemPlanLimitPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerSystemPlanLimitHandler(context: NotificationEventHandlerContext) {
  return registerHandler<SystemPlanLimitContract>(
    NotificationDownstreamEvent.SystemPlanLimit,
    (event) => {
      const payload = event.payload as unknown as SystemPlanLimitPayload
      context.dispatch(addNotification({
        id: `plan-limit-${payload.workspaceId}`,
        type: NotificationDownstreamEvent.SystemPlanLimit,
        title: `${payload.workspaceName} has reached ${payload.metric} limit`,
        body: `${payload.currentUsage} / ${payload.limit}`,
        read: false,
        createdAt: new Date().toISOString(),
        metadata: { workspaceId: payload.workspaceId, metric: payload.metric },
      }))
    },
  )
}
