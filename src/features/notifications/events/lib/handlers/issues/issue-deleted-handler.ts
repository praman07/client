/**
 * Handler: issue.deleted
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { IssueDeletedContract, IssueDeletedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerIssueDeletedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<IssueDeletedContract>(
    NotificationDownstreamEvent.IssueDeleted,
    (event) => {
      const payload = event.payload as unknown as IssueDeletedPayload
      context.dispatch(addNotification({
        id: `issue-deleted-${payload.issueId}`,
        type: NotificationDownstreamEvent.IssueDeleted,
        title: `Issue deleted by ${payload.actorName}`,
        body: 'An issue you had access to was deleted',
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { projectId: payload.projectId },
      }))
    },
  )
}
