/**
 * Handler: page:page-update
 *
 * Receives a remote Y.Doc XmlFragment delta from another collaborator.
 * Maintains a module-level registry keyed by pageId so stateless handler
 * can access the live Y.Doc — same pattern as whiteboard's board-update.ts.
 *
 * @layer Features
 */

import * as Y from 'yjs'
import type { PageUpdateBroadcastPayload } from '@/shared/contracts/pages'
import type { PageEventHandlerContext } from '../../model'
import { base64ToUint8Array } from '@/entities/page-session'
import { registerHandler } from '@/shared/ws/event-bus'
import { PageDownstreamEvent } from '@/shared/contracts/pages'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:page-update')

// ─────────────────────────────────────────────────────────────────────────────
// Module-level Y.Doc registry (pages-scoped)
// ─────────────────────────────────────────────────────────────────────────────

interface PageYDocEntry {
  ydoc: Y.Doc
  /** Set of streamIds we sent — prevents echo-applying our own updates */
  pendingStreamIds: Set<string>
}

const pageYDocRegistry = new Map<string, PageYDocEntry>()

/** Called by widgets/page-editor once the Y.Doc is initialised. */
export function registerPageYDoc(pageId: string, ydoc: Y.Doc): void {
  pageYDocRegistry.set(pageId, { ydoc, pendingStreamIds: new Set() })
  log.debug('Y.Doc registered', { pageId })
}

/** Called by widgets/page-editor on unmount. */
export function unregisterPageYDoc(pageId: string): void {
  pageYDocRegistry.delete(pageId)
  log.debug('Y.Doc unregistered', { pageId })
}

/** Called by update-ack handler to mark our own streamId. */
export function addPendingStreamId(pageId: string, streamId: string): void {
  pageYDocRegistry.get(pageId)?.pendingStreamIds.add(streamId)
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────────────────────

export function handlePageUpdate(
  payload: PageUpdateBroadcastPayload,
  _context: PageEventHandlerContext,
): void {
  const { pageId, streamId, update, userId } = payload

  const entry = pageYDocRegistry.get(pageId)
  if (!entry) {
    log.warn('Y.Doc not registered for page — update dropped', { pageId })
    return
  }

  const { ydoc, pendingStreamIds } = entry

  // Echo prevention: skip updates we sent ourselves (ACK added the streamId)
  if (pendingStreamIds.has(streamId)) {
    log.debug('Skipping own update (echo prevention)', { pageId, streamId })
    pendingStreamIds.delete(streamId)
    return
  }

  try {
    const binary = base64ToUint8Array(update)
    Y.applyUpdate(ydoc, binary, 'remote')
    log.debug('Remote update applied', {
      pageId,
      streamId,
      userId,
      size: binary.length,
    })
  } catch (err) {
    // CRDT errors are non-fatal — Tiptap convergence is self-healing
    log.error('Failed to apply remote update', { pageId, streamId, err })
  }
}

/** Registration wrapper — called by registerPageHandlers. */
export function registerPageUpdateHandler(context: PageEventHandlerContext) {
  return registerHandler(PageDownstreamEvent.PageUpdate, (event) => {
    handlePageUpdate(event.payload as PageUpdateBroadcastPayload, context)
  })
}
