import type * as Y from 'yjs'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:ydoc-registry')

/**
 * Global Y.Doc Registry for Pages
 *
 * Manages Y.Doc instances for active pages, allowing WS event handlers
 * to access the Y.Doc without coupling layers via React state or events.
 *
 * Pattern: Singleton module-level registry for cross-cutting concerns.
 * This is the ONLY correct way for stateless WS event handlers
 * (outside the React tree) to reach a live Y.Doc.
 *
 * @layer Entity
 */
class PageYDocRegistry {
  private registry = new Map<string, Y.Doc>()

  /**
   * Register a Y.Doc for a page.
   * Called by useNetworkSync when network sync starts.
   */
  register(pageId: string, ydoc: Y.Doc): void {
    if (this.registry.has(pageId)) {
      log.warn('Y.Doc already registered, replacing', { pageId })
    }
    this.registry.set(pageId, ydoc)
    log.debug('Y.Doc registered', { pageId, total: this.registry.size })
  }

  /**
   * Unregister a Y.Doc for a page.
   * Called by useNetworkSync on cleanup (unmount).
   */
  unregister(pageId: string): void {
    const existed = this.registry.delete(pageId)
    if (existed) {
      log.debug('Y.Doc unregistered', { pageId, remaining: this.registry.size })
    }
  }

  /**
   * Retrieve a Y.Doc for a page.
   * Used by event handlers (page-update, awareness-update) to apply updates.
   */
  get(pageId: string): Y.Doc | undefined {
    return this.registry.get(pageId)
  }

  has(pageId: string): boolean {
    return this.registry.has(pageId)
  }

  clear(): void {
    const count = this.registry.size
    this.registry.clear()
    log.debug('Registry cleared', { clearedCount: count })
  }

  get size(): number {
    return this.registry.size
  }
}

// Singleton instance — module-level, not React state
export const pageYdocRegistry = new PageYDocRegistry()
