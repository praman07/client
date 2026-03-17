/**
 * Read Board Elements from IndexedDB
 *
 * Opens a read-only Y.Doc via y-indexeddb, extracts Excalidraw elements,
 * then immediately destroys both to free resources.
 *
 * Architecture: Completely separate from the whiteboard page's live Y.Doc.
 * No WebSocket connection — pure local read.
 *
 * Storage format (y-excalidraw): each entry in the 'elements' Y.Array is a
 * Y.Map with two keys:
 *   - "pos": number  (sort position)
 *   - "el":  object  (the actual ExcalidrawElement)
 */

import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('thumbnail:read-elements')

// Shape of each Y.Map entry as stored by y-excalidraw
type YElementEntry = {
  pos: number
  el: Record<string, unknown>
}

// Minimal element fields we need downstream (hash + exportToBlob)
export type BoardElement = Record<string, unknown> & {
  id: string
  version: number
  isDeleted?: boolean
}

export async function readBoardElements(
  boardId: string,
): Promise<Array<BoardElement>> {
  const ydoc = new Y.Doc()
  const persistence = new IndexeddbPersistence(boardId, ydoc)

  await persistence.whenSynced

  const yElements =
    ydoc.getArray<Y.Map<YElementEntry[keyof YElementEntry]>>('elements')

  const elements = yElements
    .toArray()
    // Sort by pos (y-excalidraw ordering)
    .sort((a, b) => {
      const posA = a.get('pos') as number
      const posB = b.get('pos') as number
      return posA - posB
    })
    // Extract the actual element from the "el" key
    .map((m) => m.get('el') as BoardElement)
    // Filter out null/undefined and deleted elements
    .filter((el): el is BoardElement => !!el && !el.isDeleted)

  log.debug('Read board elements', { boardId, count: elements.length })

  // Clean up immediately — this is a one-shot read
  persistence.destroy()
  ydoc.destroy()

  return elements
}
