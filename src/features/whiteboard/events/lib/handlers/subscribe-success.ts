/**
 * Whiteboard Event Handler: Subscribe Success
 *
 * Role: Initialize board state after successful subscription
 * Responsibility: Set active collaborators, mark connection as ready
 */

import type { BoardInitPayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import { setActiveCollaborators } from '@/entities/whiteboard-presence'
import { setConnectionStatus } from '@/entities/whiteboard-session'
// import { offlineQueue } from '@/shared/lib/db' // TODO: Implement in Phase 4
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:subscribe-success')

export async function handleSubscribeSuccess(
  payload: BoardInitPayload,
  context: WhiteboardEventHandlerContext,
) {
  const { boardId, collaborators } = payload
  const { dispatch } = context

  log.debug('Board subscription successful', {
    boardId,
    collaboratorCount: collaborators.length,
  })

  // Set active collaborators in presence state
  // Note: color is auto-assigned by the entity layer
  dispatch(
    setActiveCollaborators(
      collaborators.map((c) => ({
        userId: c.userId,
        fullName: c.fullName,
        avatarUrl: c.avatarUrl,
        joinedAt: Date.now(),
        cursor: null,
        isDrawing: false,
        isIdle: false,
      })),
    ),
  )

  // Update connection status to 'connected'
  dispatch(setConnectionStatus('connected'))

  // TODO Phase 4: Flush offline queue for this board
  // try {
  //   const pendingUpdates = await offlineQueue.getForBoard(boardId)
  //   for (const item of pendingUpdates) {
  //     // Resend via WebSocket
  //     await offlineQueue.remove(item.id)
  //   }
  // } catch (error) {
  //   log.error('Failed to flush offline queue:', error)
  // }
}
