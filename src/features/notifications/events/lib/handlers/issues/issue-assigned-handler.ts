/**
 * Handler: issue.assigned
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { IssueAssignedContract, IssueAssignedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerIssueAssignedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<IssueAssignedContract>(
    NotificationDownstreamEvent.IssueAssigned,
    (event) => {
      const payload = event.payload as unknown as IssueAssignedPayload
      context.dispatch(addNotification({
        id: `issue-assigned-${payload.issueId}`,
        type: NotificationDownstreamEvent.IssueAssigned,
        title: `You were assigned to issue #${payload.issueNumber}`,
        body: payload.issueTitle,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { issueId: payload.issueId, projectId: payload.projectId },
      }))
    },
  )
}
