/**
 * Handler: whiteboard.archived
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WhiteboardArchivedContract, WhiteboardArchivedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWhiteboardArchivedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WhiteboardArchivedContract>(
    NotificationDownstreamEvent.WhiteboardArchived,
    (event) => {
      const payload = event.payload as unknown as WhiteboardArchivedPayload
      context.dispatch(addNotification({
        id: `whiteboard-archived-${payload.boardId}`,
        type: NotificationDownstreamEvent.WhiteboardArchived,
        title: `Whiteboard archived by ${payload.actorName}`,
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
