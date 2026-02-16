/**
 * Whiteboard Event Handler: Update ACK (Phase 2 - Fixed Deduplication)
 *
 * Handles acknowledgment from server when update is successfully appended to stream.
 * Directly adds streamId to PendingUpdatesTracker for echo prevention.
 *
 * @layer Features
 * @module whiteboard/events/handlers
 */

import type { UpdateAckPayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import type { PendingUpdatesTracker } from '@/widgets/whiteboard-canvas/lib/pending-updates-tracker'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:update-ack')

// ========================================
// Tracker Registry
// ========================================
// Global registry to access pending trackers from handlers
const trackerRegistry = new Map<string, PendingUpdatesTracker>()

/**
 * Register a pending updates tracker for a board
 * Called by useNetworkSync when network sync starts
 */
export function registerTracker(
  boardId: string,
  tracker: PendingUpdatesTracker,
) {
  trackerRegistry.set(boardId, tracker)
  log.debug('Tracker registered for board', { boardId })
}

/**
 * Unregister a pending updates tracker
 * Called by useNetworkSync on cleanup
 */
export function unregisterTracker(boardId: string) {
  trackerRegistry.delete(boardId)
  log.debug('Tracker unregistered for board', { boardId })
}

// ========================================
// Handler
// ========================================

/**
 * Handle update acknowledgment from server
 *
 * When server successfully appends our update to Redis stream, it sends ACK with streamId.
 * We add streamId to pending tracker so when broadcast arrives, we can skip it (echo prevention).
 *
 * @param payload - ACK payload with dedupeId, streamId, boardId, status
 * @param _context - Handler context (unused)
 */
export function handleUpdateAck(
  payload: UpdateAckPayload,
  _context: WhiteboardEventHandlerContext,
) {
  const { dedupeId, streamId, boardId, status } = payload

  log.debug('📨 Received update ACK', {
    boardId,
    dedupeId,
    streamId,
    status,
  })

  // Get tracker for this board
  const tracker = trackerRegistry.get(boardId)
  if (!tracker) {
    log.warn('Tracker not found for board, ACK ignored', { boardId })
    return
  }

  // Add streamId to pending set (echo prevention)
  tracker.add(streamId)

  if (status === 'duplicate') {
    log.debug('Update was duplicate (server already had it)', { dedupeId })
  }
}
