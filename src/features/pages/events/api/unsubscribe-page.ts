import { wsManager } from '@/shared/ws/manager'
import { PageUpstreamEvent } from '@/shared/contracts/pages'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:unsubscribe')

/**
 * Unsubscribe from a page's update stream.
 * Called on widget unmount — triggers user-left broadcast to other subscribers.
 */
export function unsubscribePage(pageId: string): void {
  log.debug('Unsubscribing from page', { pageId })
  wsManager.emit(PageUpstreamEvent.Unsubscribe, { pageId })
}
