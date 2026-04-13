/**
 * Handler: page.mention
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { PageMentionContract, PageMentionPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerPageMentionHandler(context: NotificationEventHandlerContext) {
  return registerHandler<PageMentionContract>(
    NotificationDownstreamEvent.PageMention,
    (event) => {
      const payload = event.payload as unknown as PageMentionPayload
      context.dispatch(addNotification({
        id: `page-mention-${payload.pageId}-${payload.mentionedUserId}`,
        type: NotificationDownstreamEvent.PageMention,
        title: `${payload.actorName} mentioned you in a page`,
        body: payload.pageTitle,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { pageId: payload.pageId, projectId: payload.projectId },
      }))
    },
  )
}
