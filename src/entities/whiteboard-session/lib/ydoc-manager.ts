import * as Y from 'yjs'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:ydoc')

const ydocStore = new Map<string, Y.Doc>()

export function createYDoc(boardId: string): Y.Doc {
  if (ydocStore.has(boardId)) {
    log.warn(`Y.Doc already exists for board ${boardId}`)
    return ydocStore.get(boardId)!
  }

  const ydoc = new Y.Doc()

  // ✅ CRITICAL: Initialize with correct structure for y-excalidraw
  // Prevents type conflicts when binding attempts to create these
  // y-excalidraw expects:
  // - ydoc.getArray('elements') → Y.Array<Y.Map<any>>
  // - ydoc.getMap('assets') → Y.Map
  ydoc.getArray('elements') // Creates empty Y.Array
  ydoc.getMap('assets') // Creates empty Y.Map

  ydocStore.set(boardId, ydoc)
  log.debug(`Created Y.Doc for board ${boardId} with Y.Array structure`)
  return ydoc
}

export function getYDoc(boardId: string): Y.Doc | null {
  return ydocStore.get(boardId) ?? null
}

export function destroyYDoc(boardId: string): void {
  const ydoc = ydocStore.get(boardId)
  if (ydoc) {
    ydoc.destroy()
    ydocStore.delete(boardId)
    log.debug(`Destroyed Y.Doc for board ${boardId}`)
  }
}

/**
 * Apply a remote Y.js update to the local Y.Doc
 *
 * CRITICAL: Must pass 'remote' origin to prevent infinite loops.
 * Without origin, the update event triggers with origin=undefined,
 * causing local handlers to re-broadcast the update back to server.
 *
 * @param boardId - Board ID
 * @param update - Y.js binary update
 */
export function applyRemoteUpdate(boardId: string, update: Uint8Array): void {
  const ydoc = getYDoc(boardId)
  if (!ydoc) {
    throw new Error(`Y.Doc not found for board ${boardId}`)
  }

  // ✅ CRITICAL: Pass 'remote' origin to prevent re-broadcast loop
  Y.applyUpdate(ydoc, update, 'remote')

  log.debug(`Applied remote update`, {
    boardId,
    updateSize: update.length,
  })
}
