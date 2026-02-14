/**
 * Whiteboard Event Handler: Update ACK
 *
 * Role: Process server acknowledgment of board updates
 * Responsibility: Decrement pending count for UI feedback and clean offline queue
 */

import type { UpdateAckPayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import {
  decrementPendingCount,
  offlineQueue,
} from '@/entities/whiteboard-session'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:update-ack')

export async function handleUpdateAck(
  payload: UpdateAckPayload,
  context: WhiteboardEventHandlerContext,
) {
  const { dedupeId } = payload
  const { dispatch } = context

  // Validate payload
  if (!dedupeId) {
    log.error('Received UpdateAck with missing dedupeId', { payload })
    return
  }

  log.debug('Received update ACK', { dedupeId })

  // Decrement pending count (UI feedback)
  dispatch(decrementPendingCount(1))

  // ✅ Clean from offline queue
  try {
    const clearedCount = await offlineQueue.cleanup(dedupeId)

    if (clearedCount > 0) {
      log.info('Removed ACKed update from queue', {
        dedupeId,
        clearedCount,
      })
    }
  } catch (error) {
    log.warn('Failed to remove from offline queue:', error)
  }
}
