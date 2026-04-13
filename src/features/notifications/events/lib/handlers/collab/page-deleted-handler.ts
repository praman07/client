/**
 * Handler: page.deleted
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { PageDeletedContract, PageDeletedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerPageDeletedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<PageDeletedContract>(
    NotificationDownstreamEvent.PageDeleted,
    (event) => {
      const payload = event.payload as unknown as PageDeletedPayload
      context.dispatch(addNotification({
        id: `page-deleted-${payload.pageId}`,
        type: NotificationDownstreamEvent.PageDeleted,
        title: `Page deleted by ${payload.actorName}`,
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
