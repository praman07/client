/**
 * Handler: page.collaborator.removed
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { PageCollaboratorRemovedContract, PageCollaboratorRemovedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerPageCollaboratorRemovedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<PageCollaboratorRemovedContract>(
    NotificationDownstreamEvent.PageCollaboratorRemoved,
    (event) => {
      const payload = event.payload as unknown as PageCollaboratorRemovedPayload
      context.dispatch(addNotification({
        id: `page-collab-remove-${payload.pageId}-${payload.removedUserId}`,
        type: NotificationDownstreamEvent.PageCollaboratorRemoved,
        title: `${payload.actorName} removed ${payload.removedUserName} from a page`,
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
