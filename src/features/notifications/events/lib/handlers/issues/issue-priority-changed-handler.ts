/**
 * Handler: issue.priority.changed
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { IssuePriorityChangedContract, IssuePriorityChangedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerIssuePriorityChangedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<IssuePriorityChangedContract>(
    NotificationDownstreamEvent.IssuePriorityChanged,
    (event) => {
      const payload = event.payload as unknown as IssuePriorityChangedPayload
      context.dispatch(addNotification({
        id: `issue-priority-${payload.issueId}`,
        type: NotificationDownstreamEvent.IssuePriorityChanged,
        title: `Issue #${payload.issueNumber} priority changed to ${payload.newPriority}`,
        body: payload.issueTitle,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { issueId: payload.issueId, projectId: payload.projectId, oldPriority: payload.oldPriority, newPriority: payload.newPriority },
      }))
    },
  )
}
