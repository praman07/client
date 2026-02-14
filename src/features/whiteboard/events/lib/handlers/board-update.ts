/**
 * Whiteboard Event Handler: Board Update (Refactored)
 *
 * Role: Dispatch remote Y.js CRDT updates via custom event
 * Security: Validates updates before dispatching
 *
 * Note: Uses event-based communication with useWhiteboardSync hook
 */

import type { BoardUpdatePayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import {
  isValidYjsUpdate,
  base64ToUint8Array,
} from '@/entities/whiteboard-session'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:board-update')

export function handleBoardUpdate(
  payload: BoardUpdatePayload,
  _context: WhiteboardEventHandlerContext,
) {
  const { boardId, update } = payload

  // Guard: Validate payload structure
  if (!update) {
    log.error('Invalid payload: missing update data', { boardId, payload })
    return
  }

  log.debug('Received board update', {
    boardId,
    updateSize: update.length,
  })

  // Convert Base64 to Uint8Array
  const binary = base64ToUint8Array(update)

  // Security: Validate Y.js update structure
  if (!isValidYjsUpdate(binary)) {
    log.error('[BoardUpdate] Invalid Y.js update received', { boardId })
    return
  }

  // ✅ Dispatch custom event for useWhiteboardSync to handle
  window.dispatchEvent(
    new CustomEvent('board-update', {
      detail: { boardId, update: binary },
    }),
  )

  log.debug('Board update event dispatched', { boardId })
}
