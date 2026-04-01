/**
 * Whiteboard Event Handler: Board Locked
 *
 * Role: Handle board lock event from admin
 * Responsibility: Update lock state, show toast notification
 */

import { toast } from 'sonner'
import type { BoardLockedPayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import { setConnectionStatus } from '@/entities/whiteboard-session'
import { registerHandler } from '@/shared/ws/event-bus'
import { WhiteboardDownstreamEvent } from '@/shared/contracts/whiteboard/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:board-locked')

export function handleBoardLocked(
  payload: BoardLockedPayload,
  context: WhiteboardEventHandlerContext,
) {
  const { boardId, lockedBy } = payload
  const { dispatch, queryClient } = context

  log.info('Board locked', { boardId, lockedBy })

  // Update connection status to locked
  dispatch(setConnectionStatus('locked'))

  // Invalidate board metadata queries (lock status changed)
  queryClient.invalidateQueries({
    queryKey: ['whiteboard-board', 'detail', boardId],
  })

  // Show toast notification
  toast.info('Board has been locked by an admin')
}

/** Registration wrapper — called by registerWhiteboardHandlers. */
export function registerBoardLockedHandler(context: WhiteboardEventHandlerContext) {
  return registerHandler(WhiteboardDownstreamEvent.BoardLocked, (event) => {
    handleBoardLocked(event.payload as BoardLockedPayload, context)
  })
}
