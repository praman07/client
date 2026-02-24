/**
 * PAGES PLUGIN: Domain plugin for page WebSocket events
 *
 * Responsibility:
 * - Register page event types with domain registry
 * - Wire up page event handlers
 * - Bridge between wsManager and features/pages/events
 *
 * Mirrors whiteboard-plugin.ts structure exactly.
 *
 * @layer App
 */

import { createDomainPlugin } from '@/shared/ws/domains'
import { registerPageHandlers } from '@/features/pages/events'
import type { PageEventHandlerContext } from '@/features/pages/events'
import {
  PageUpstreamEvent,
  PageDownstreamEvent,
} from '@/shared/contracts/pages/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:pages-plugin')

const UPSTREAM_EVENTS = Object.values(PageUpstreamEvent)
const DOWNSTREAM_EVENTS = Object.values(PageDownstreamEvent)

/** Page updates and awareness updates are high priority — real-time collaboration hot path */
const PRIORITY_RULES = [
  (type: string) =>
    type === PageUpstreamEvent.PageUpdate ||
    type === PageUpstreamEvent.AwarenessUpdate,
]

let cleanupHandlers: (() => void) | null = null

/**
 * Creates the pages WS domain plugin.
 * Called once at app startup alongside createWhiteboardPlugin.
 *
 * @param context - Page event handler dependencies (dispatch, queryClient, userId)
 */
export function createPagesPlugin(context: PageEventHandlerContext) {
  return createDomainPlugin({
    domain: 'pages',
    upstreamEvents: UPSTREAM_EVENTS,
    downstreamEvents: DOWNSTREAM_EVENTS,
    priorityRules: PRIORITY_RULES,

    registerHandlers() {
      log.debug('Registering page event handlers')
      cleanupHandlers = registerPageHandlers(context)
      log.debug('Page handlers registered')
    },

    cleanup() {
      log.debug('Cleaning up page handlers')
      if (cleanupHandlers) {
        cleanupHandlers()
        cleanupHandlers = null
      }
    },

    onConnect() {
      log.debug('Pages plugin: WebSocket connected')
    },

    onDisconnect() {
      log.debug('Pages plugin: WebSocket disconnected')
    },

    onReconnect() {
      log.debug('Pages plugin: WebSocket reconnected')
    },
  })
}

export { UPSTREAM_EVENTS, DOWNSTREAM_EVENTS }
