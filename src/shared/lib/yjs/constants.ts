/**
 * Y.js Update Origins (Type-Safe)
 *
 * Used to track where updates come from for proper handling.
 * Prevents issues with string literals and provides centralized constants.
 *
 * @layer Shared
 * @module lib/yjs
 */

/**
 * Origin types for Y.js updates
 *
 * These constants are used as the `origin` parameter in Y.js operations:
 * - Y.applyUpdate(ydoc, update, origin)
 * - ydoc.on('update', (update, origin) => {})
 */
export const YjsOrigin = {
  /**
   * Update from local user interaction
   * Used when user draws/edits on the canvas
   */
  Local: 'local' as const,

  /**
   * Update from IndexedDB restore
   * Used when loading persisted data from IndexedDB
   */
  IndexedDB: 'indexeddb' as const,

  /**
   * Update from remote WebSocket broadcast
   * NOTE: We don't use this anymore - we use streamId deduplication instead
   * Kept for backward compatibility
   */
  Remote: 'remote' as const,
} as const

/**
 * Type for Y.js origin values
 */
export type YjsOriginType = (typeof YjsOrigin)[keyof typeof YjsOrigin]

/**
 * Check if origin indicates a local update (should be sent to server)
 *
 * Local updates include:
 * - undefined/null (direct Y.Doc changes)
 * - YjsOrigin.Local (explicitly marked)
 * - ExcalidrawBinding (user drawing on canvas)
 *
 * NOT local (skip sending):
 * - YjsOrigin.IndexedDB (from persistence restore)
 * - YjsOrigin.Remote (from network, would create echo loop)
 *
 * @param origin - Origin value from Y.js update event
 * @returns true if update is local and should be sent to server
 *
 * @example
 * ```typescript
 * ydoc.on('update', (update, origin) => {
 *   if (isLocalOrigin(origin)) {
 *     sendToServer(update)
 *   }
 * })
 * ```
 */
 
export function isLocalOrigin(origin: any): boolean {
  // Exclude: IndexedDB and Remote
  // Everything else (undefined, null, 'local', ExcalidrawBinding) is local
  return origin !== YjsOrigin.IndexedDB && origin !== YjsOrigin.Remote
}

/**
 * Check if origin is from IndexedDB (don't send to server)
 *
 * @param origin - Origin value from Y.js update event
 * @returns true if update is from IndexedDB persistence
 *
 * @example
 * ```typescript
 * ydoc.on('update', (update, origin) => {
 *   if (isIndexedDBOrigin(origin)) {
 *     return // Skip, already persisted
 *   }
 * })
 * ```
 */
 
export function isIndexedDBOrigin(origin: any): boolean {
  return origin === YjsOrigin.IndexedDB
}
