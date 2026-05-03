/**
 * Handler: whiteboard.locked
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WhiteboardLockedContract, WhiteboardLockedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWhiteboardLockedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WhiteboardLockedContract>(
    NotificationDownstreamEvent.WhiteboardLocked,
    (event) => {
      const payload = event.payload as unknown as WhiteboardLockedPayload
      context.dispatch(addNotification({
        id: `whiteboard-locked-${payload.boardId}`,
        type: NotificationDownstreamEvent.WhiteboardLocked,
        title: `Whiteboard locked by ${payload.actorName}`,
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
