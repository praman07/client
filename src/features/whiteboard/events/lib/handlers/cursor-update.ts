/**
 * Whiteboard Event Handler: Cursor Update
 *
 * Role: Handle remote cursor position updates
 * Responsibility: Update cursor position in presence state
 */

import type { CursorUpdatePayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import { updateCursorPosition } from '@/entities/whiteboard-presence'

export function handleCursorUpdate(
  payload: CursorUpdatePayload,
  context: WhiteboardEventHandlerContext,
) {
  const { userId, x, y } = payload
  const { dispatch } = context

  // Skip logging to avoid spam (cursors update at 60fps)

  // Update cursor position with {x, y} object
  dispatch(
    updateCursorPosition({
      userId,
      cursor: { x, y },
    }),
  )
}
