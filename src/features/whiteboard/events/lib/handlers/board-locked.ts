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
