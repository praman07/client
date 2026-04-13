/**
 * Handler: page.archived
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { PageArchivedContract, PageArchivedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerPageArchivedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<PageArchivedContract>(
    NotificationDownstreamEvent.PageArchived,
    (event) => {
      const payload = event.payload as unknown as PageArchivedPayload
      context.dispatch(addNotification({
        id: `page-archived-${payload.pageId}`,
        type: NotificationDownstreamEvent.PageArchived,
        title: `Page archived by ${payload.actorName}`,
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
