import * as Y from 'yjs'

const ydocStore = new Map<string, Y.Doc>()

export function createYDoc(boardId: string): Y.Doc {
  if (ydocStore.has(boardId)) {
    console.warn(`[YDocManager] Y.Doc already exists for board ${boardId}`)
    return ydocStore.get(boardId)!
  }

  const ydoc = new Y.Doc()
  ydocStore.set(boardId, ydoc)
  console.log(`[YDocManager] Created Y.Doc for board ${boardId}`)
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
    console.log(`[YDocManager] Destroyed Y.Doc for board ${boardId}`)
  }
}

export function applyRemoteUpdate(boardId: string, update: Uint8Array): void {
  const ydoc = getYDoc(boardId)
  if (!ydoc) {
    throw new Error(`Y.Doc not found for board ${boardId}`)
  }
  Y.applyUpdate(ydoc, update)
}
