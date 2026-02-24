/**
 * Send Page Update — Online/Offline aware
 *
 * Online path:  emit page:update via WS immediately
 * Offline path: enqueue to IndexedDB via pageOfflineQueue
 *
 * @layer Features
 */

import { wsManager } from '@/shared/ws/manager'
import { PageUpstreamEvent } from '@/shared/contracts/pages'
import { pageOfflineQueue } from '@/entities/page-session'
import { uint8ArrayToBase64 } from '@/entities/page-session'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:send-page-update')

export async function sendPageUpdate(
  pageId: string,
  update: Uint8Array,
  isOnline: boolean,
): Promise<string> {
  const dedupeId = crypto.randomUUID()

  if (!isOnline) {
    log.info('Offline — queuing update', {
      pageId,
      dedupeId,
      size: update.length,
    })
    await pageOfflineQueue.enqueue(pageId, update, dedupeId)
    return dedupeId
  }

  log.debug('Online — sending update via WS', {
    pageId,
    dedupeId,
    size: update.length,
  })

  wsManager.emit(PageUpstreamEvent.PageUpdate, {
    pageId,
    update: uint8ArrayToBase64(update),
    dedupeId,
  })

  return dedupeId
}
