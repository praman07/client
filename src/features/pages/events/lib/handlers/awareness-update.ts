/**
 * Handler: page:awareness-update (downstream broadcast)
 *
 * Server re-broadcasts another user's awareness state (cursor, selection)
 * to all other subscribers. We forward the binary to the active
 * PageAwarenessProvider which applies it to Tiptap's CollaborationCursor.
 *
 * The provider is registered per-page by the widget on mount via
 * registerPageAwarenessProvider() — not kept in global Redux context.
 *
 * @layer Features
 */

import type { AwarenessUpdateBroadcastPayload } from '@/shared/contracts/pages'
import type { PageEventHandlerContext } from '../../model'
import type { PageAwarenessProvider } from '@/entities/page-session'
import { registerHandler } from '@/shared/ws/event-bus'
import { PageDownstreamEvent } from '@/shared/contracts/pages'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:awareness-update')

// Module-level provider registry (one per active page)
const awarenessRegistry = new Map<string, PageAwarenessProvider>()

/** Called by widgets/page-editor on mount with the live provider instance. */
export function registerPageAwarenessProvider(
  pageId: string,
  provider: PageAwarenessProvider,
): void {
  awarenessRegistry.set(pageId, provider)
  log.debug('AwarenessProvider registered', { pageId })
}

/** Called by widgets/page-editor on unmount. */
export function unregisterPageAwarenessProvider(pageId: string): void {
  awarenessRegistry.delete(pageId)
  log.debug('AwarenessProvider unregistered', { pageId })
}

export function handleAwarenessUpdate(
  payload: AwarenessUpdateBroadcastPayload,
  context: PageEventHandlerContext,
  pageId: string, // passed by register-handlers from the frame envelope
): void {
  const { update, userId } = payload

  // Skip self — server should already exclude via originSocketId but guard here too
  if (userId === context.userId) return

  const provider = awarenessRegistry.get(pageId)
  if (!provider) {
    log.debug('No awareness provider registered for page', { pageId })
    return
  }

  try {
    // applyRemoteUpdate accepts base64 string and decodes internally
    provider.applyRemoteUpdate(update)
    log.debug('Remote awareness update applied', { pageId, userId })
  } catch (err) {
    log.error('Failed to apply remote awareness update', {
      pageId,
      userId,
      err,
    })
  }
}

/**
 * Registration wrapper — called by registerPageHandlers.
 * Extracts pageId from the event envelope and passes it to handleAwarenessUpdate.
 */
export function registerPageAwarenessUpdateHandler(context: PageEventHandlerContext) {
  return registerHandler(PageDownstreamEvent.AwarenessUpdate, (event) => {
    const payload = event.payload as AwarenessUpdateBroadcastPayload & { pageId?: string }
    // pageId is available in the event envelope — pass through
    handleAwarenessUpdate(payload, context, payload.pageId ?? '')
  })
}
