/**
 * Whiteboard Event Handler: User Left
 *
 * Role: Handle collaborator leaving the board
 * Responsibility: Remove collaborator from presence state
 */

import type { UserLeftPayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import { removeCollaborator } from '@/entities/whiteboard-presence'
import { registerHandler } from '@/shared/ws/event-bus'
import { WhiteboardDownstreamEvent } from '@/shared/contracts/whiteboard/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:user-left')

export function handleUserLeft(
  payload: UserLeftPayload,
  context: WhiteboardEventHandlerContext,
) {
  const { userId } = payload
  const { dispatch } = context

  log.debug('User left board', { userId })

  // Remove collaborator from presence state
  dispatch(removeCollaborator({ userId }))
}

/** Registration wrapper — called by registerWhiteboardHandlers. */
export function registerUserLeftHandler(context: WhiteboardEventHandlerContext) {
  return registerHandler(WhiteboardDownstreamEvent.UserLeft, (event) => {
    handleUserLeft(event.payload as UserLeftPayload, context)
  })
}
