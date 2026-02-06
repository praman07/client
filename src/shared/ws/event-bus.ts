/**
 * EVENT BUS: Domain-agnostic event system
 *
 * Responsibility:
 * - Provide pub/sub for application events
 * - Support type-safe event registration and dispatch
 * - Enable loose coupling between features
 *
 * Architecture:
 * - Generic event structure (type + payload)
 * - Domains register their own event handlers via plugins
 * - No domain-specific imports in this file
 */

/**
 * Base event structure.
 * All events must have a type string and optional payload.
 */
import { createLogger } from '@/shared/lib/logger'

export interface BaseEvent {
  type: string
  payload?: unknown
}

/**
 * Recovery event: Internal system event for gap detection.
 * This is framework-level, not domain-specific.
 */
export type RecoveryRequestedEvent = {
  type: 'intent:recovery-requested'
  payload: {
    conversationId: string
    projectId: string | null
    lastStreamId: string | null
    lastSequence: number
    gapSize: number
  }
}

/**
 * Generic application event type.
 * Domains can extend this via their own type definitions.
 */
export type AppEvent = BaseEvent | RecoveryRequestedEvent

type EventHandler<T> = (event: T) => void

const handlers = new Map<string, Set<EventHandler<any>>>()

const log = createLogger('ws:bus')

/**
 * Registers a handler for a specific event type.
 * @param eventType Strict event type string (e.g., 'chat:new-message')
 * @param handler Function to process the event
 */
export function registerHandler<T extends AppEvent>(
  eventType: T['type'],
  handler: EventHandler<T>,
) {
  if (!handlers.has(eventType)) {
    handlers.set(eventType, new Set())
  }
  const set = handlers.get(eventType)!

  // Prevent duplicates naturally via Set
  set.add(handler)

  log.debug(`Registered handler for: ${eventType}`)

  // Unsubscribe capability
  return () => {
    set.delete(handler)
    log.debug(`Unregistered handler for: ${eventType}`)
  }
}

/**
 * Dispatches an event to all registered handlers.
 * @param event The typed event object
 */
export function dispatchEvent(event: AppEvent) {
  const set = handlers.get(event.type)
  if (!set || set.size === 0) {
    log.debug(`No handlers for: ${event.type}`)
    return
  }

  // Dispatch to all listeners
  set.forEach((fn) => {
    try {
      fn(event)
    } catch (err) {
      log.error(`Handler failed for ${event.type}`, err)
    }
  })
}
