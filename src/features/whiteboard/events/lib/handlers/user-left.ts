/**
 * Whiteboard Event Handler: User Left
 *
 * Role: Handle collaborator leaving the board
 * Responsibility: Remove collaborator from presence state
 */

import type { UserLeftPayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import { removeCollaborator } from '@/entities/whiteboard-presence'
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
