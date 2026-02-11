/**
 * Whiteboard Event Handler: Board Update
 *
 * Role: Apply remote Y.js CRDT updates to local document
 * Security: Validates updates before applying
 */

import type { BoardUpdatePayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import {
  applyRemoteUpdate,
  isValidYjsUpdate,
  base64ToUint8Array,
} from '@/entities/whiteboard-session'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:board-update')

export function handleBoardUpdate(
  payload: BoardUpdatePayload,
  _context: WhiteboardEventHandlerContext, // Unused but required for handler signature
) {
  const { boardId, update } = payload

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

  // Apply to local Y.Doc
  try {
    applyRemoteUpdate(boardId, binary)
    log.debug('Successfully applied board update', { boardId })
  } catch (error) {
    log.error('[BoardUpdate] Failed to apply update:', error)
  }
}
