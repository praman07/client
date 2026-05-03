/**
 * Handler: issue.status.changed
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { IssueStatusChangedContract, IssueStatusChangedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerIssueStatusChangedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<IssueStatusChangedContract>(
    NotificationDownstreamEvent.IssueStatusChanged,
    (event) => {
      const payload = event.payload as unknown as IssueStatusChangedPayload
      context.dispatch(addNotification({
        id: `issue-status-${payload.issueId}`,
        type: NotificationDownstreamEvent.IssueStatusChanged,
        title: `Issue #${payload.issueNumber} moved to ${payload.newStatus}`,
        body: payload.issueTitle,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { issueId: payload.issueId, projectId: payload.projectId, oldStatus: payload.oldStatus, newStatus: payload.newStatus },
      }))
    },
  )
}
