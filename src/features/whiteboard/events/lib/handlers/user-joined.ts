/**
 * Whiteboard Event Handler: User Joined
 *
 * Role: Handle new collaborator joining the board
 * Responsibility: Add collaborator to presence state
 */

import type { UserJoinedPayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import { addCollaborator } from '@/entities/whiteboard-presence'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:user-joined')

export function handleUserJoined(
  payload: UserJoinedPayload,
  context: WhiteboardEventHandlerContext,
) {
  const { userId, fullName, avatarUrl, timestamp } = payload
  const { dispatch } = context

  log.debug('📨 User joined event received', {
    payload,
    fullName,
    avatarUrl,
    timestamp,
  })

  // Validate payload
  if (!userId) {
    log.error('❌ Invalid user-joined payload: missing userId', { payload })
    return
  }

  if (!fullName) {
    log.warn('⚠️ User joined with undefined fullName', { userId, payload })
  }

  log.debug('🚀 Dispatching addCollaborator action', {
    userId,
    fullName,
    avatarUrl: avatarUrl || 'null',
  })

  // Add collaborator to presence state
  // Note: color is auto-assigned by the entity layer
  dispatch(
    addCollaborator({
      userId,
      fullName,
      avatarUrl,
      joinedAt: Date.now(),
      cursor: null,
      isDrawing: false,
      isIdle: false,
    }),
  )

  log.debug('✅ addCollaborator dispatched successfully')
}
