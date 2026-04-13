/**
 * Handler: page.locked
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { PageLockedContract, PageLockedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerPageLockedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<PageLockedContract>(
    NotificationDownstreamEvent.PageLocked,
    (event) => {
      const payload = event.payload as unknown as PageLockedPayload
      context.dispatch(addNotification({
        id: `page-locked-${payload.pageId}`,
        type: NotificationDownstreamEvent.PageLocked,
        title: `Page locked by ${payload.actorName}`,
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
