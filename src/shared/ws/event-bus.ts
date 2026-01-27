import type { ChatDownstreamEvent } from '@/shared/contracts/chat/downstream'

export type RecoveryRequestedEvent = {
  type: 'intent:recovery-requested'
  payload: {
    conversationId: string
    projectId: string | null
    lastStreamId: string | null
  }
}

export type BaseAppEvent = { type: string }
export type AppEvent =
  | ChatDownstreamEvent
  | RecoveryRequestedEvent
  | BaseAppEvent

type EventHandler<T> = (event: T) => void

const handlers = new Map<string, Set<EventHandler<any>>>()

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

  console.log(`[EventBus] Registered handler for: ${eventType}`)

  // Unsubscribe capability
  return () => {
    set.delete(handler)
    console.debug(`[EventBus] Unregistered handler for: ${eventType}`)
  }
}

/**
 * Dispatches an event to all registered handlers.
 * @param event The typed event object
 */
export function dispatchEvent(event: AppEvent) {
  const set = handlers.get(event.type)
  if (!set || set.size === 0) {
    console.debug(`[EventBus] No handlers for: ${event.type}`)
    return
  }

  // Dispatch to all listeners
  set.forEach((fn) => {
    try {
      fn(event)
    } catch (err) {
      console.error(`[EventBus] Handler failed for ${event.type}`, err)
    }
  })
}
