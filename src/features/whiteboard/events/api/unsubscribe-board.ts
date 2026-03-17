/**
 * Unsubscribe from Board - Public API Action
 *
 * Unsubscribes from a board session via WebSocket
 * Cleans up presence and stops receiving updates
 *
 * @layer Features
 * @module whiteboard/events/api
 */

import type { UnsubscribeBoardPayload } from '@/shared/contracts/whiteboard/upstream'
import { wsManager } from '@/shared/ws/manager'
import { WhiteboardUpstreamEvent } from '@/shared/contracts/whiteboard/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:unsubscribe')

/**
 * Unsubscribe from a board session
 *
 * This will:
 * 1. Send unsubscribe event to server
 * 2. Server removes user from collaborators
 * 3. Stop receiving board updates
 *
 * @param boardId - The board ID to unsubscribe from
 *
 * @example
 * ```ts
 * import { unsubscribeBoard } from '@/features/whiteboard/events'
 *
 * // In your whiteboard component cleanup
 * useEffect(() => {
 *   return () => {
 *     unsubscribeBoard(boardId)
 *   }
 * }, [boardId])
 * ```
 */
export function unsubscribeBoard(boardId: string): void {
  log.info('Unsubscribing from board', { boardId })

  const payload: UnsubscribeBoardPayload = {
    boardId,
  }

  wsManager.emit(WhiteboardUpstreamEvent.Unsubscribe, payload)
}
