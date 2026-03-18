import { Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates } from 'y-protocols/awareness'
import { base64ToUint8Array, uint8ArrayToBase64 } from '../encoding'
import type * as Y from 'yjs'
import { wsManager } from '@/shared/ws/manager'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:awareness-provider')

/**
 * PageAwarenessProvider — Custom Tiptap Awareness Adapter
 *
 * Tiptap's CollaborationCursor extension expects a "provider" object with
 * a `.awareness` property (y-protocols/awareness Awareness instance).
 *
 * We do NOT use TiptapCollabProvider (requires Tiptap Cloud / Hocuspocus).
 * Instead this class is a minimal adapter that bridges:
 *   awareness.on('update') → wsManager.emit(page:awareness-update)
 *   applyRemoteUpdate()    ← called by useNetworkSync on page:awareness-update
 *
 * Awareness updates flow:
 *   Local cursor moves → Tiptap writes to awareness → we send to server via WS
 *   Remote cursor arrives on WS → applyRemoteUpdate → Tiptap re-renders cursor
 *
 * @layer Entity
 */

// Upstream event constant — matches server WS contract
const PAGE_AWARENESS_EVENT = 'page:awareness-update'

interface AwarenessUpdate {
  added: Array<number>
  updated: Array<number>
  removed: Array<number>
}

export class PageAwarenessProvider {
  readonly awareness: Awareness
  private pageId: string
  private destroyed = false

  constructor(
    ydoc: Y.Doc,
    pageId: string,
    user: { name: string; color: string },
  ) {
    this.pageId = pageId
    this.awareness = new Awareness(ydoc)

    // Set own state — propagated to all peers on next change
    this.awareness.setLocalStateField('user', user)
    this.awareness.setLocalStateField('cursor', null) // Tiptap writes cursor here

    // When local awareness state changes → send to server
    this.awareness.on('update', this.handleLocalUpdate)

    log.debug('PageAwarenessProvider created', { pageId })
  }

  private handleLocalUpdate = ({
    added,
    updated,
    removed,
  }: AwarenessUpdate) => {
    if (this.destroyed) return

    const changedClients = [...added, ...updated, ...removed]
    const update = encodeAwarenessUpdate(this.awareness, changedClients)
    const encoded = uint8ArrayToBase64(update)

    wsManager.emit(PAGE_AWARENESS_EVENT, {
      pageId: this.pageId,
      update: encoded,
    })
  }

  /**
   * Apply a remote awareness update received from the server.
   * Called by useNetworkSync when page:awareness-update arrives.
   * Tiptap's CollaborationCursor automatically re-renders remote cursors.
   */
  applyRemoteUpdate(encodedUpdate: string): void {
    if (this.destroyed) return

    try {
      const update = base64ToUint8Array(encodedUpdate)
      applyAwarenessUpdate(this.awareness, update, this)
    } catch (error) {
      log.error('Failed to apply remote awareness update', {
        pageId: this.pageId,
        error,
      })
    }
  }

  /**
   * Remove own awareness state and clean up.
   * Called on unmount / WS disconnect.
   */
  destroy(): void {
    if (this.destroyed) return
    this.destroyed = true

    this.awareness.off('update', this.handleLocalUpdate)
    removeAwarenessStates(
      this.awareness,
      [this.awareness.clientID],
      'disconnect',
    )
    this.awareness.destroy()

    log.debug('PageAwarenessProvider destroyed', { pageId: this.pageId })
  }
}
