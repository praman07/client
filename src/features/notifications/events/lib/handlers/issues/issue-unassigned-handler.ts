/**
 * Handler: issue.unassigned
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { IssueUnassignedContract, IssueUnassignedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerIssueUnassignedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<IssueUnassignedContract>(
    NotificationDownstreamEvent.IssueUnassigned,
    (event) => {
      const payload = event.payload as unknown as IssueUnassignedPayload
      context.dispatch(addNotification({
        id: `issue-unassigned-${payload.issueId}`,
        type: NotificationDownstreamEvent.IssueUnassigned,
        title: `You were removed from issue #${payload.issueNumber}`,
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
