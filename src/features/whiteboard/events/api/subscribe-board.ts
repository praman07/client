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
 * 2. Server responds with board-init (snapshot, collaborators)
 * 3. Event handlers process the response
 *
 * @param boardId - The board ID to subscribe to
 *
 * @example
 * ```ts
 * import { subscribeBoard } from '@/features/whiteboard/events'
 *
 * // In your whiteboard component on mount
 * useEffect(() => {
 *   subscribeBoard(boardId)
 *   return () => unsubscribeBoard(boardId)
 * }, [boardId])
 * ```
 */
export function subscribeBoard(boardId: string): void {
  log.info('Subscribing to board', { boardId })

  const payload: SubscribeBoardPayload = {
    boardId,
  }

  wsManager.emit(WhiteboardUpstreamEvent.Subscribe, payload)
}
