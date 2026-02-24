/**
 * Handler: page:update-ack
 *
 * Server confirms our update is durably in the Redis stream.
 * We record the streamId in the Y.Doc registry so page-update
 * handler can skip our own echo when the broadcast arrives.
 *
 * @layer Features
 */

import type { UpdateAckPayload } from '@/shared/contracts/pages'
import type { PageEventHandlerContext } from '../../model'
import { pageOfflineQueue } from '@/entities/page-session'
import { addPendingStreamId } from './page-update'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:update-ack')

export function handleUpdateAck(
  payload: UpdateAckPayload,
  _context: PageEventHandlerContext,
): void {
  const { pageId, dedupeId, streamId, status } = payload

  log.debug('Update ACK received', { pageId, dedupeId, streamId, status })

  if (status === 'duplicate') {
    log.debug('Duplicate update — server already had it', { dedupeId })
    // Still clean up offline queue in case we re-queued on reconnect
    pageOfflineQueue.cleanup(dedupeId).catch((err) => {
      log.error('Failed to cleanup offline queue for duplicate', {
        dedupeId,
        err,
      })
    })
    return
  }

  // Register streamId for echo prevention in page-update handler
  addPendingStreamId(pageId, streamId)

  // Remove from offline queue — update is now durable
  pageOfflineQueue.cleanup(dedupeId).catch((err) => {
    log.error('Failed to cleanup offline queue after ACK', { dedupeId, err })
  })
}
