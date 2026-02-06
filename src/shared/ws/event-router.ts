/**
 * EVENT ROUTER: STRICT BOUNDARY
 * This file MUST NOT import from:
 * - features/*
 * - contracts/* (domain logic)
 * - app/*
 *
 * Responsibility: Single ingress fan-out and replication (Leader → Follower).
 * 100% Domain agnostic - works with chat, whiteboard, presence, etc.
 */
import { dispatchEvent } from './event-bus'
import type { ServerMessage } from './protocol/core-protocol'
import { leaderElection } from '@/shared/lib/broadcast/leader-election'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:router')

// Generic types - no domain coupling
type EventType = string

// Internal type for erased handlers
type GenericEventHandler = (payload: never) => void

// Module-level state
const handlers = new Map<EventType, Set<GenericEventHandler>>()

export const eventRouter = {
  /**
   * Register a handler for a specific event type.
   * Type-safe when called with specific domain event types.
   */
  on<TPayload = unknown>(
    type: EventType,
    handler: (payload: TPayload) => void,
  ) {
    if (!handlers.has(type)) {
      handlers.set(type, new Set())
    }
    const typeHandlers = handlers.get(type)!

    // Safety: Type erasure for storage. Validated by on/dispatch duality.
    typeHandlers.add(handler as unknown as GenericEventHandler)

    // Unsubscribe
    return () => {
      typeHandlers.delete(handler as unknown as GenericEventHandler)
    }
  },

  /**
   * Main Dispatch Entry Point.
   * Accepts any ServerMessage envelope with {type, data} structure.
   */
  dispatch(envelope: ServerMessage, fromRelay = false) {
    // 1. Broadcast (Leader Only)
    if (leaderElection.isLeader() && !fromRelay) {
      leaderElection.relay(envelope)
    }

    // 2. Local Dispatch to EventRouter handlers
    const typeHandlers = handlers.get(envelope.type)

    log.debug(
      `Dispatching ${envelope.type} to ${typeHandlers?.size || 0} handlers`,
    )

    if (typeHandlers) {
      typeHandlers.forEach((genericHandler) => {
        try {
          // Safety: Handler type matches envelope type by design of .on()
          const specificHandler = genericHandler as unknown as (
            payload: typeof envelope.data,
          ) => void
          specificHandler(envelope.data)
        } catch (error) {
          log.error(`Error in handler for ${envelope.type}:`, error)
        }
      })
    }

    // 3. Bridge to EventBus for backward compatibility
    // This allows handlers using registerHandler() to receive WebSocket events
    try {
      const appEvent = {
        type: envelope.type,
        payload: envelope.data || {},
      }
      dispatchEvent(appEvent as any)
    } catch (error) {
      log.error(`Bridge to EventBus failed for ${envelope.type}:`, error)
    }
  },

  // Debug helper
  getListenerCount(type: EventType) {
    return handlers.get(type)?.size || 0
  },
}

// --- Relay Listener (Singleton Guard for HMR) ---
let relayListenerRegistered = false

if (!relayListenerRegistered) {
  leaderElection.onRelay((payload) => {
    // Prevent cycles by flagging as fromRelay
    eventRouter.dispatch(payload as ServerMessage, true)
  })
  relayListenerRegistered = true
}
