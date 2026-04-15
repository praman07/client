/**
 * NOTIFICATION PLUGIN: Domain plugin for notification WebSocket events
 *
 * Responsibility:
 * - Register notification event types with domain registry
 * - Wire up notification event handlers
 * - Bridge between wsManager and features/notifications/events
 *
 * Mirrors chat-plugin.ts and pages-plugin.ts structure exactly.
 *
 * @layer App
 */

import type { NotificationEventHandlerContext } from '@/features/notifications/events'
import { createDomainPlugin } from '@/shared/ws/domains'
import { registerNotificationHandlers } from '@/features/notifications/events'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'
import { createLogger } from '@/shared/lib/logger'
import '@/shared/ui/toast/config'

const log = createLogger('ws:notification-plugin')

const DOWNSTREAM_EVENTS = Object.values(NotificationDownstreamEvent)

export function createNotificationPlugin(context: NotificationEventHandlerContext) {
  let cleanupHandlers: (() => void) | null = null

  return createDomainPlugin({
    domain: 'notification',
    upstreamEvents: [],
    downstreamEvents: DOWNSTREAM_EVENTS,

    registerHandlers() {
      log.debug('Registering notification event handlers')
      cleanupHandlers = registerNotificationHandlers(context)
      log.debug('Notification handlers registered')
    },

    cleanup() {
      log.debug('Cleaning up notification handlers')
      if (cleanupHandlers) {
        cleanupHandlers()
        cleanupHandlers = null
      }
    },

    onConnect() {
      log.debug('Notification plugin: WebSocket connected')
    },

    onDisconnect() {
      log.debug('Notification plugin: WebSocket disconnected')
    },

    onReconnect() {
      log.debug('Notification plugin: WebSocket reconnected')
    },
  })
}

export { DOWNSTREAM_EVENTS }
