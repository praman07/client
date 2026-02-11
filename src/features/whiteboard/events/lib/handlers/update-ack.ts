/**
 * Whiteboard Event Handler: Update ACK
 *
 * Role: Process server acknowledgment of board updates
 * Responsibility: Decrement pending count for UI feedback
 */

import type { UpdateAckPayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import { decrementPendingCount } from '@/entities/whiteboard-session'
// import { offlineQueue } from '@/shared/lib/db' // TODO: Implement in Phase 4
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:update-ack')

export async function handleUpdateAck(
  payload: UpdateAckPayload,
  context: WhiteboardEventHandlerContext,
) {
  const { dedupeId } = payload
  const { dispatch } = context

  log.debug('Received update ACK', { dedupeId })

  // Decrement pending count (UI feedback)
  dispatch(decrementPendingCount(1))

  // TODO Phase 4: Remove from offline queue
  // try {
  //   await offlineQueue.removeByDedupeId(dedupeId)
  //   log.debug('Removed ACKed update from queue', { dedupeId })
  // } catch (error) {
  //   log.warn('Failed to remove from offline queue:', error)
  // }
}
