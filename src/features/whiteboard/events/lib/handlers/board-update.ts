/**
 * Whiteboard Event Handler: Board Update (Phase 2 - Fixed Deduplication)
 *
 * Applies remote Y.js CRDT updates directly to Y.Doc
 * Security: Validates updates before applying
 *
 * Deduplication Strategy:
 * - Uses PendingUpdatesTracker to check streamIds
 * - Skips updates with pending streamIds (our own updates)
 * - Applies all other updates (remote changes)
 * - NO origin markers (allows ExcalidrawBinding to see updates)
 */

import * as Y from 'yjs'
import type { BoardUpdatePayload } from '@/shared/contracts/whiteboard/downstream'
import type { WhiteboardEventHandlerContext } from '../../model'
import {
  isValidYjsUpdate,
  base64ToUint8Array,
} from '@/entities/whiteboard-session'
import type { PendingUpdatesTracker } from '@/widgets/whiteboard-canvas/lib/pending-updates-tracker'
import { YjsOrigin } from '@/shared/lib/yjs/constants'
import { createLogger } from '@/shared/lib/logger'
import { safeApplyUpdate } from '@/shared/lib/yjs/safe-apply-update'

const log = createLogger('whiteboard:board-update')

// ========================================
// Y.Doc Registry with Tracker (Phase 2)
// ========================================
// Global registry to access Y.Doc instances and trackers from handlers
// Handlers are stateless but need to apply updates to Y.Doc

interface YDocEntry {
  ydoc: Y.Doc
  tracker: PendingUpdatesTracker
}

const ydocRegistry = new Map<string, YDocEntry>()

/**
 * Register a Y.Doc with its pending updates tracker
 * Called by useNetworkSyncV2 when network sync starts
 *
 * @param boardId - Board ID
 * @param ydoc - Y.Doc instance
 * @param tracker - Pending updates tracker
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
 * Called by useNetworkSyncV2 on cleanup
 *
 * @param boardId - Board ID
 */
export function unregisterYDoc(boardId: string) {
  ydocRegistry.delete(boardId)
  log.debug('Y.Doc unregistered', { boardId })
}

// ========================================
// Handler
// ========================================

export function handleBoardUpdate(
  payload: BoardUpdatePayload,
  _context: WhiteboardEventHandlerContext,
) {
  const { boardId, streamId, update } = payload

  // Guard: Validate payload structure
  if (!update) {
    log.error('Invalid payload: missing update data', { boardId, payload })
    return
  }

  // log.debug('📥 Received board update', {
  //   boardId,
  //   streamId,
  //   updateSize: update.length,
  //   updateType: typeof update,
  //   isString: typeof update === 'string',
  // })

  // Validate update is base64 string
  if (typeof update !== 'string') {
    log.error('Update is not a string!', { boardId, updateType: typeof update })
    return
  }

  // Convert Base64 → Uint8Array
  const binary = base64ToUint8Array(update)

  // log.debug('Converted to binary', {
  //   boardId,
  //   binarySize: binary.length,
  //   originalSize: update.length,
  // })

  // Security: Validate Y.js update structure
  if (!isValidYjsUpdate(binary)) {
    log.error('[BoardUpdate] Invalid Y.js update received', { boardId })
    return
  }

  // Get Y.Doc entry for this board
  const entry = ydocRegistry.get(boardId)
  if (!entry) {
    log.warn('Y.Doc not found for board, update ignored', { boardId })
    return
  }

  const { ydoc, tracker } = entry

  // ========================================
  // Deduplication: Check if this is our own update
  // ========================================
  if (tracker.has(streamId)) {
    log.debug('⏩ Skipping own update (echo prevention)', {
      boardId,
      streamId,
    })
    // Remove from tracker (we've seen it now)
    tracker.remove(streamId)
    return
  }

  // ========================================
  // Apply remote update
  // ========================================
  log.debug('✅ Applying remote update to Y.Doc', {
    boardId,
    streamId,
    updateSize: binary.length,
  })

  // log.debug('🔧 About to call Y.applyUpdate with origin:', {
  //   boardId,
  //   streamId,
  //   origin: YjsOrigin.Remote,
  //   ydocExists: !!ydoc,
  // })

  // // Check Y.Array state BEFORE applying update
  // try {
  //   const yElements = ydoc.getArray('elements')
  //   const yAssets = ydoc.getMap('assets')

  //   log.debug('📊 Y.Doc state BEFORE Y.applyUpdate:', {
  //     boardId,
  //     streamId,
  //     elementCount: yElements.length,
  //     assetCount: yAssets.size,
  //     firstElement: yElements.length > 0 ? yElements.get(0) : null,
  //     ydocClientId: ydoc.clientID,
  //   })
  // } catch (e) {
  //   log.warn('Could not read Y.Doc state before update', e)
  // }

  // Apply update WITH 'remote' origin
  const result = safeApplyUpdate(
    ydoc,
    binary,
    {
      context: 'client:board-update',
      boardId,
      streamId,
      origin: YjsOrigin.Remote,
      throwOnError: false, // Non-fatal, continue processing
    },
    log,
  )

  if (!result.success) {
    const error = result.error!
    const errorMessage = error.message

    // 🛡️ DEFENSIVE: Check for duplicate/conflict errors
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
      return // Silent failure - OK
    }

    // Unknown error - throw
    throw error
  }

  log.info('✅ Remote update applied', {
    boardId,
    streamId,
    elementsDelta: result.elementsDelta,
  })

  // // Check Y.Array state AFTER applying update
  // try {
  //   const yElements = ydoc.getArray('elements')
  //   log.debug('📊 Y.Array state AFTER Y.applyUpdate:', {
  //     boardId,
  //     streamId,
  //     elementCount: yElements.length,
  //     firstElement: yElements.length > 0 ? yElements.get(0) : null,
  //     lastElement:
  //       yElements.length > 0 ? yElements.get(yElements.length - 1) : null,
  //   })
  // } catch (e) {
  //   log.warn('Could not read Y.Array after update', e)
  // }

  // log.debug('✨ Remote update applied successfully (Y.applyUpdate returned)', {
  //   boardId,
  //   streamId,
  // })

  // // Wait a tick to see if observer fires
  // setTimeout(() => {
  //   log.debug('⏱️  100ms after Y.applyUpdate - checking if observers fired', {
  //     boardId,
  //     streamId,
  //   })
  // }, 100)
}
