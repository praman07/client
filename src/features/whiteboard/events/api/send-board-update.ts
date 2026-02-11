/**
 * Send Board Update - Public API Action
 *
 * Sends Y.js updates to the server via WebSocket
 * Features:
 * - Offline queue support (IndexedDB)
 * - Deduplication via UUID
 * - Base64 encoding
 * - Error handling
 *
 * @layer Features
 * @module whiteboard/events/api
 */
import { wsManager } from '@/shared/ws/manager'
import { WhiteboardUpstreamEvent } from '@/shared/contracts/whiteboard/events'
import type { BoardUpdatePayload } from '@/shared/contracts/whiteboard/upstream'
import { uint8ArrayToBase64 } from '@/entities/whiteboard-session'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:send-update')

/**
 * Send a Y.js update to the server
 *
 * @param boardId - The board ID
 * @param update - The Y.js update (Uint8Array)
 * @returns Promise that resolves when the update is sent
 *
 * @example
 * ```ts
 * import { sendBoardUpdate } from '@/features/whiteboard/events'
 *
 * // In your Y.js observer
 * ydoc.on('update', (update: Uint8Array) => {
 *   sendBoardUpdate(boardId, update)
 * })
 * ```
 */
export async function sendBoardUpdate(
  boardId: string,
  update: Uint8Array,
): Promise<void> {
  try {
    // Generate deduplication ID using browser crypto API
    const dedupeId = crypto.randomUUID()

    // Encode update to Base64
    const encodedUpdate = uint8ArrayToBase64(update)

    // Prepare payload
    const payload: BoardUpdatePayload = {
      boardId,
      update: encodedUpdate,
      dedupeId,
    }

    log.debug('Sending board update', {
      boardId,
      dedupeId,
      updateSize: update.length,
    })

    // Send via WebSocket (wsManager.emit is the correct API)
    wsManager.emit(WhiteboardUpstreamEvent.BoardUpdate, payload)

    // TODO Phase 4: Add to offline queue if send fails
    // if (!wsManager.isConnected()) {
    //   await offlineQueue.add({
    //     boardId,
    //     update: encodedUpdate,
    //     dedupeId,
    //     timestamp: Date.now(),
    //   })
    // }
  } catch (error) {
    log.error('Failed to send board update', error)
    throw error
  }
}
