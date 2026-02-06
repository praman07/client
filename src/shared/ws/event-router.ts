/**
 * EVENT ROUTER: STRICT BOUNDARY
 * This file MUST NOT import from:
 * - features/*
 * - contracts/* (domain logic)
 * - app/*
 *
 * Responsibility: Single ingress fan-out and replication (Leader -> Follower).
 * Domain agnostic.
 */
import { dispatchEvent } from './event-bus'
import type {
  ServerEventName,
  ServerEventPayloads,
  ServerMessageUnion,
} from './protocol'
import { leaderElection } from '@/shared/lib/broadcast/leader-election'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:router')

// Internal type for erased handlers
type GenericEventHandler = (payload: never) => void

// Module-level state
const handlers = new Map<ServerEventName, Set<GenericEventHandler>>()

export const eventRouter = {
  on<T extends ServerEventName>(
    type: T,
    handler: (payload: ServerEventPayloads[T]) => void,
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

  // Main Dispatch Entry Point
  dispatch(envelope: ServerMessageUnion, fromRelay = false) {
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

    // 3. **NEW**: Bridge to EventBus for backward compatibility
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
  getListenerCount(type: ServerEventName) {
    return handlers.get(type)?.size || 0
  },
}

// --- Relay Listener (Singleton Guard for HMR) ---
let relayListenerRegistered = false

if (!relayListenerRegistered) {
  leaderElection.onRelay((payload) => {
    // Prevent cycles by flagging as fromRelay
    eventRouter.dispatch(payload as ServerMessageUnion, true)
  })
  relayListenerRegistered = true
}
