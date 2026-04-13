/**
 * Handler: whiteboard.collaborator.added
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WhiteboardCollaboratorAddedContract, WhiteboardCollaboratorAddedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWhiteboardCollaboratorAddedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WhiteboardCollaboratorAddedContract>(
    NotificationDownstreamEvent.WhiteboardCollaboratorAdded,
    (event) => {
      const payload = event.payload as unknown as WhiteboardCollaboratorAddedPayload
      context.dispatch(addNotification({
        id: `whiteboard-collab-add-${payload.boardId}-${payload.addedUserId}`,
        type: NotificationDownstreamEvent.WhiteboardCollaboratorAdded,
        title: `${payload.actorName} added ${payload.addedUserName} to a whiteboard`,
        body: payload.boardTitle,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { boardId: payload.boardId, projectId: payload.projectId },
      }))
    },
  )
}
