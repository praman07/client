/**
 * Subscribe to Board - Public API Action
 *
 * Subscribes to a board session via WebSocket
 * Triggers server to send board-init with snapshot and collaborators
 *
 * @layer Features
 * @module whiteboard/events/api
 */

import { wsManager } from '@/shared/ws/manager'
import { WhiteboardUpstreamEvent } from '@/shared/contracts/whiteboard/events'
import type { SubscribeBoardPayload } from '@/shared/contracts/whiteboard/upstream'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:subscribe')

/**
 * Subscribe to a board session
 *
 * This will:
 * 1. Send subscribe event to server
 * 2. Server calculates replay gap from lastStreamId
 * 3. Server sends replay-updates (if gap exists)
 * 4. Server responds with subscribe-success
 *
 * @param input - Subscribe parameters
 * @param input.boardId - The board ID to subscribe to
 * @param input.lastStreamId - Last stream ID from snapshot (for replay gap)
 *
 * @example
 * ```ts
 * import { subscribeBoard } from '@/features/whiteboard/events'
 *
 * // After fetching snapshot
 * const { snapshot, lastStreamId } = await getBoardSnapshot(boardId)
 * Y.applyUpdate(ydoc, snapshot)
 * subscribeBoard({ boardId, lastStreamId })
 * ```
 */
export function subscribeBoard(input: {
  boardId: string
  lastStreamId?: string
}): void {
  const { boardId, lastStreamId } = input

  log.info('Subscribing to board', { boardId, lastStreamId })

  const payload: SubscribeBoardPayload = {
    boardId,
    lastStreamId,
  }

  wsManager.emit(WhiteboardUpstreamEvent.Subscribe, payload)
}
