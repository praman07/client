/**
 * Whiteboard Event Handler: Board Unlocked
 *
 * Role: Handle board unlock event from admin
 * Responsibility: Update lock state, show toast notification
 */

import type { BoardUnlockedPayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import { setConnectionStatus } from '@/entities/whiteboard-session'
import { toast } from 'sonner'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:board-unlocked')

export function handleBoardUnlocked(
  payload: BoardUnlockedPayload,
  context: WhiteboardEventHandlerContext,
) {
  const { boardId, unlockedBy } = payload
  const { dispatch, queryClient } = context

  log.info('Board unlocked', { boardId, unlockedBy })

  // Update connection status to connected
  dispatch(setConnectionStatus('connected'))

  // Invalidate board metadata queries
  queryClient.invalidateQueries({
    queryKey: ['whiteboard-board', 'detail', boardId],
  })

  // Show toast notification
  toast.success('Board has been unlocked')
}
