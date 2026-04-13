/**
 * Handler: page.collaborator.added
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { PageCollaboratorAddedContract, PageCollaboratorAddedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerPageCollaboratorAddedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<PageCollaboratorAddedContract>(
    NotificationDownstreamEvent.PageCollaboratorAdded,
    (event) => {
      const payload = event.payload as unknown as PageCollaboratorAddedPayload
      context.dispatch(addNotification({
        id: `page-collab-add-${payload.pageId}-${payload.addedUserId}`,
        type: NotificationDownstreamEvent.PageCollaboratorAdded,
        title: `${payload.actorName} added ${payload.addedUserName} to a page`,
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
