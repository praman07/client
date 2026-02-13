import * as Y from 'yjs'

interface SyncEngineOptions {
  boardId: string
  ydoc: Y.Doc
  onUpdate?: (update: Uint8Array) => void
  onSync?: () => void
}

interface SyncEngine {
  ydoc: Y.Doc
  elementsMap: Y.Map<unknown>
  destroy: () => void
}

/**
 * Initialize Y.js sync engine for board
 *
 * Sets up Y.Map for elements and registers update handlers
 */
export function initializeSyncEngine(options: SyncEngineOptions): SyncEngine {
  const { boardId, ydoc, onUpdate, onSync } = options

  console.info('[SyncEngine] Initializing', { boardId })

  // Get or create elements map
  const elementsMap = ydoc.getMap('elements')

  // Register update handler
  const updateHandler = (update: Uint8Array, origin: unknown) => {
    // Only call onUpdate for local changes
    if (origin === 'local' && onUpdate) {
      onUpdate(update)
    }
  }

  ydoc.on('update', updateHandler)

  // Notify sync complete
  if (onSync) {
    onSync()
  }

  console.info('[SyncEngine] Initialized', {
    boardId,
    elementCount: elementsMap.size,
  })

  return {
    ydoc,
    elementsMap,
    destroy: () => {
      console.info('[SyncEngine] Destroying', { boardId })
      ydoc.off('update', updateHandler)
    },
  }
}

/**
 * Destroy sync engine and cleanup
 */
export function destroySyncEngine(engine: SyncEngine): void {
  engine.destroy()
}
