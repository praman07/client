import * as Y from 'yjs'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:ydoc-registry')

/**
 * Global Y.Doc Registry
 *
 * Manages Y.Doc instances and Excalidraw APIs for active boards,
 * allowing direct access from event handlers without coupling layers via events.
 *
 * Pattern: Singleton registry for cross-cutting concerns
 */
class YDocRegistry {
  private registry = new Map<string, Y.Doc>()
  private apis = new Map<string, ExcalidrawImperativeAPI>()

  /**
   * Register a Y.Doc (and optionally Excalidraw API) for a board
   * Called when useWhiteboardSync initializes
   */
  register(
    boardId: string,
    ydoc: Y.Doc,
    excalidrawAPI?: ExcalidrawImperativeAPI,
  ): void {
    if (this.registry.has(boardId)) {
      log.warn('Y.Doc already registered, replacing', { boardId })
    }
    this.registry.set(boardId, ydoc)

    if (excalidrawAPI) {
      this.apis.set(boardId, excalidrawAPI)
    }

    log.debug('Y.Doc registered', {
      boardId,
      total: this.registry.size,
      hasAPI: !!excalidrawAPI,
    })
  }

  /**
   * Unregister a Y.Doc for a board
   * Called when useWhiteboardSync unmounts
   */
  unregister(boardId: string): void {
    const existed = this.registry.delete(boardId)
    this.apis.delete(boardId)

    if (existed) {
      log.debug('Y.Doc unregistered', {
        boardId,
        remaining: this.registry.size,
      })
    }
  }

  /**
   * Get Y.Doc for a board
   * Used by event handlers to apply remote updates
   */
  get(boardId: string): Y.Doc | undefined {
    return this.registry.get(boardId)
  }

  /**
   * Get Excalidraw API for a board
   * Used by event handlers to update canvas directly
   */
  getAPI(boardId: string): ExcalidrawImperativeAPI | undefined {
    return this.apis.get(boardId)
  }

  /**
   * Check if board has registered Y.Doc
   */
  has(boardId: string): boolean {
    return this.registry.has(boardId)
  }

  /**
   * Clear all registrations
   * Used for testing/cleanup
   */
  clear(): void {
    const count = this.registry.size
    this.registry.clear()
    this.apis.clear()
    log.debug('Registry cleared', { clearedCount: count })
  }

  /**
   * Get count of registered Y.Docs
   */
  get size(): number {
    return this.registry.size
  }
}

// Singleton instance
export const ydocRegistry = new YDocRegistry()
