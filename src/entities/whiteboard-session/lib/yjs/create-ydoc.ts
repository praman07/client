import * as Y from 'yjs'

export interface YDocConfig {
  boardId: string
  gc?: boolean // Garbage collection (default: true)
  guid?: string // Optional custom GUID
}

/**
 * Factory to create and configure Y.Doc instances for whiteboard boards
 *
 * @param config - Configuration for the Y.Doc
 * @returns Configured Y.Doc instance with pre-initialized shared types
 */
export function createYDoc(config: YDocConfig): Y.Doc {
  const ydoc = new Y.Doc({
    guid: config.guid || config.boardId, // ✅ Use guid if provided, otherwise boardId
    gc: config.gc ?? true,
  })

  // Pre-initialize shared types for consistency
  // These match the structure expected by y-excalidraw binding
  ydoc.getArray<Y.Map<any>>('elements') // Whiteboard elements
  ydoc.getMap('assets') // Binary assets (images, etc.)

  return ydoc
}
