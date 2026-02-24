import { wsManager } from '@/shared/ws/manager'
import { PageUpstreamEvent } from '@/shared/contracts/pages'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:subscribe')

/**
 * Subscribe to a page's real-time update stream.
 * Call AFTER getPageSnapshot (GraphQL) has been applied to the local Y.Doc.
 *
 * @param pageId - Page to subscribe to
 * @param lastStreamId - Last stream ID the client processed. '0-0' = first open.
 */
export function subscribePage(pageId: string, lastStreamId = '0-0'): void {
  log.debug('Subscribing to page', { pageId, lastStreamId })
  wsManager.emit(PageUpstreamEvent.Subscribe, { pageId, lastStreamId })
}
