import type { CursorUpdatePayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import { updateCursorPosition } from '@/entities/whiteboard-presence'
import { registerHandler } from '@/shared/ws/event-bus'
import { WhiteboardDownstreamEvent } from '@/shared/contracts/whiteboard/events'

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

/** Registration wrapper — called by registerWhiteboardHandlers. */
export function registerCursorUpdateHandler(context: WhiteboardEventHandlerContext) {
  return registerHandler(WhiteboardDownstreamEvent.CursorUpdate, (event) => {
    handleCursorUpdate(event.payload as CursorUpdatePayload, context)
  })
}
