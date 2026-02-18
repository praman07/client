/**
 * Whiteboard Event Handler: Board Deleted
 *
 * Role: Handle board deletion broadcast from server
 * Responsibility: Clean local state (IndexedDB + cache) and notify user
 *
 * Architecture: Module-level callback registry (same pattern as board-update.ts ydocRegistry)
 * allows the stateless WS handler to trigger React state on the active board page.
 */

import type { BoardDeletedPayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import { boardKeys } from '@/entities/whiteboard-board'
import { cleanBoardFromIndexedDB } from '@/features/whiteboard/delete-board'
import { toast } from 'sonner'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:board-deleted')

// Module-level registry: boardId → callback
// Registered by the board page when it mounts; called when deletion event arrives
const deletionCallbacks = new Map<string, () => void>()

/**
 * Register a callback to be called when this board is deleted.
 * Called by BoardViewPage on mount.
 */
export function registerBoardDeletedCallback(boardId: string, cb: () => void) {
  deletionCallbacks.set(boardId, cb)
  log.debug('Board deletion callback registered', { boardId })
}

/**
 * Unregister the callback for this board.
 * Called by BoardViewPage on unmount.
 */
export function unregisterBoardDeletedCallback(boardId: string) {
  deletionCallbacks.delete(boardId)
  log.debug('Board deletion callback unregistered', { boardId })
}

export function handleBoardDeleted(
  payload: BoardDeletedPayload,
  context: WhiteboardEventHandlerContext,
) {
  const { boardId } = payload
  const { queryClient } = context

  log.info('Board deleted by creator', {
    boardId,
    deletedBy: payload.deletedBy,
  })

  // Remove detail + snapshot cache immediately
  queryClient.removeQueries({ queryKey: boardKeys.detail(boardId) })
  queryClient.removeQueries({ queryKey: boardKeys.snapshot(boardId) })
  queryClient.removeQueries({ queryKey: boardKeys.collaborators(boardId) })

  // Invalidate all board lists so they refresh
  queryClient.invalidateQueries({ queryKey: boardKeys.lists() })

  // Clean IndexedDB (non-blocking, non-fatal)
  cleanBoardFromIndexedDB(boardId)

  // Trigger modal if user is actively on this board's page
  const cb = deletionCallbacks.get(boardId)
  if (cb) {
    log.debug('Triggering board-deleted overlay', { boardId })
    cb()
  } else {
    // User is not on this board — show toast notification instead
    toast.error('A board was deleted', {
      description: 'A board you have access to has been permanently deleted.',
    })
  }
}
