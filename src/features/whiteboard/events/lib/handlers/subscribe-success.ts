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

const log = createLogger('whiteboard:subscribe')

export async function handleSubscribeSuccess(
  payload: BoardInitPayload,
  context: WhiteboardEventHandlerContext,
) {
  const { boardId, collaborators } = payload
  const { dispatch } = context

  log.debug('📨 Subscribe success received', {
    boardId,
    collaboratorCount: collaborators.length,
    collaborators: collaborators.map((c) => ({
      userId: c.userId,
      fullName: c.fullName,
      avatarUrl: c.avatarUrl,
    })),
  })

  // Validate collaborators
  collaborators.forEach((c, index) => {
    if (!c.fullName) {
      log.warn(`⚠️ Collaborator #${index} has undefined fullName`, c)
    }
  })

  log.debug('🚀 Dispatching setActiveCollaborators action')

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

  log.debug('✅ setActiveCollaborators dispatched successfully')

  // Update connection status to 'connected'
  dispatch(setConnectionStatus('connected'))
  log.debug('✅ Connection status set to connected')

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
