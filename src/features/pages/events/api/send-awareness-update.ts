/**
 * Send Awareness Update — fire-and-forget
 *
 * No ACK, no offline queue, no dedupeId.
 * Server handler just PUBLISHes to awareness channel — purely ephemeral.
 *
 * Called by PageAwarenessProvider.handleLocalUpdate() when local cursors move.
 *
 * @layer Features
 */

import { wsManager } from '@/shared/ws/manager'
import { PageUpstreamEvent } from '@/shared/contracts/pages'
import { uint8ArrayToBase64 } from '@/entities/page-session'

export function sendAwarenessUpdate(pageId: string, update: Uint8Array): void {
  wsManager.emit(PageUpstreamEvent.AwarenessUpdate, {
    pageId,
    update: uint8ArrayToBase64(update),
  })
}
