import type * as Y from 'yjs'
import type { BoardUpdatePayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import type { PendingUpdatesTracker } from '@/shared/lib/yjs'
import {
  base64ToUint8Array,
  isValidYjsUpdate,
} from '@/entities/whiteboard-session'
import { YjsOrigin } from '@/shared/lib/yjs/constants'
import { createLogger } from '@/shared/lib/logger'
import { safeApplyUpdate } from '@/shared/lib/yjs/safe-apply-update'
import { registerHandler } from '@/shared/ws/event-bus'
import { WhiteboardDownstreamEvent } from '@/shared/contracts/whiteboard/events'

const log = createLogger('whiteboard:board-update')

interface YDocEntry {
  ydoc: Y.Doc
  tracker: PendingUpdatesTracker
}

const ydocRegistry = new Map<string, YDocEntry>()

/**
 * Register a Y.Doc with its pending updates tracker
 *
 * Architecture: Registry pattern enables stateless event handlers to access Y.Doc instances.
 * Tracker is co-located to support echo prevention via streamId deduplication.
 *
 * Called by useNetworkSync when network sync starts
 */
export function registerYDoc(
  boardId: string,
  ydoc: Y.Doc,
  tracker: PendingUpdatesTracker,
) {
  ydocRegistry.set(boardId, { ydoc, tracker })
  log.debug('Y.Doc registered with tracker', { boardId })
}

/**
 * Unregister a Y.Doc for a board
 * Called by useNetworkSync on cleanup
 *
 * @param boardId - Board ID
 */
export function unregisterYDoc(boardId: string) {
  ydocRegistry.delete(boardId)
  log.debug('Y.Doc unregistered', { boardId })
}

export function handleBoardUpdate(
  payload: BoardUpdatePayload,
  _context: WhiteboardEventHandlerContext,
) {
  const { boardId, streamId, update } = payload

  if (!update) {
    log.error('Invalid payload: missing update data', { boardId, payload })
    return
  }

  if (typeof update !== 'string') {
    log.error('Update is not a string!', { boardId, updateType: typeof update })
    return
  }

  const binary = base64ToUint8Array(update)

  if (!isValidYjsUpdate(binary)) {
    log.error('[BoardUpdate] Invalid Y.js update received', { boardId })
    return
  }

  const entry = ydocRegistry.get(boardId)
  if (!entry) {
    log.warn('Y.Doc not found for board, update ignored', { boardId })
    return
  }

  const { ydoc, tracker } = entry

  /**
   * Architecture: Echo Prevention via StreamID Tracking
   *
   * When we send an update to server, we receive ACK with streamId.
   * Server broadcasts that update back to all clients (including us).
   * We track our streamIds in pending tracker and skip applying our own updates.
   * This prevents infinite loops and maintains CRDT convergence.
   */
  if (tracker.has(streamId)) {
    log.debug('⏩ Skipping own update (echo prevention)', {
      boardId,
      streamId,
    })
    // Remove from tracker (we've seen it now)
    tracker.remove(streamId)
    return
  }
  const result = safeApplyUpdate(
    ydoc,
    binary,
    {
      context: 'client:board-update',
      boardId,
      streamId,
      origin: YjsOrigin.Remote,
      throwOnError: false,
    },
    log,
  )

  if (!result.success) {
    const error = result.error!
    const errorMessage = error.message

    const isDuplicateOrConflict =
      errorMessage.includes('splice') ||
      errorMessage.includes('getMissing') ||
      errorMessage.includes('Cannot read properties of undefined')

    if (isDuplicateOrConflict) {
      log.warn('⚠️ Ignoring duplicate/conflicting update (non-fatal)', {
        boardId,
        streamId,
        error: errorMessage,
      })
      return
    }

    throw error
  }

  log.info('✅ Remote update applied', {
    boardId,
    streamId,
    elementsDelta: result.elementsDelta,
  })
}

/** Registration wrapper — called by registerWhiteboardHandlers. */
export function registerBoardUpdateHandler(context: WhiteboardEventHandlerContext) {
  return registerHandler(WhiteboardDownstreamEvent.BoardUpdate, (event) => {
    // Backend sends { type, data: { boardId, update, ... } } — extract nested data
    const payload = (event.payload as any).data || event.payload
    handleBoardUpdate(payload as BoardUpdatePayload, context)
  })
}
