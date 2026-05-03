/**
 * Handler: issue.mention
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { IssueMentionContract, IssueMentionPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerIssueMentionHandler(context: NotificationEventHandlerContext) {
  return registerHandler<IssueMentionContract>(
    NotificationDownstreamEvent.IssueMention,
    (event) => {
      const payload = event.payload as unknown as IssueMentionPayload
      context.dispatch(addNotification({
        id: `issue-mention-${payload.issueId}-${payload.mentionedUserId}`,
        type: NotificationDownstreamEvent.IssueMention,
        title: `${payload.actorName} mentioned you in issue #${payload.issueNumber}`,
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
