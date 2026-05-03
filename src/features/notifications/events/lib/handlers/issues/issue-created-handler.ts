/**
 * Handler: issue.created
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { IssueCreatedContract, IssueCreatedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerIssueCreatedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<IssueCreatedContract>(
    NotificationDownstreamEvent.IssueCreated,
    (event) => {
      const payload = event.payload as unknown as IssueCreatedPayload
      context.dispatch(addNotification({
        id: `issue-created-${payload.issueId}`,
        type: NotificationDownstreamEvent.IssueCreated,
        title: `New issue #${payload.issueNumber} in ${payload.projectName}`,
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
