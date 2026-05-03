/**
 * Handler: whiteboard.collaborator.removed
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WhiteboardCollaboratorRemovedContract, WhiteboardCollaboratorRemovedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWhiteboardCollaboratorRemovedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WhiteboardCollaboratorRemovedContract>(
    NotificationDownstreamEvent.WhiteboardCollaboratorRemoved,
    (event) => {
      const payload = event.payload as unknown as WhiteboardCollaboratorRemovedPayload
      context.dispatch(addNotification({
        id: `whiteboard-collab-remove-${payload.boardId}-${payload.removedUserId}`,
        type: NotificationDownstreamEvent.WhiteboardCollaboratorRemoved,
        title: `${payload.actorName} removed ${payload.removedUserName} from a whiteboard`,
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
