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
import type {
  ServerEventName,
  ServerEventPayloads,
  ServerMessageUnion,
} from './protocol'
import { leaderElection } from '@/shared/lib/broadcast/leader-election'

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

    // 2. Local Dispatch
    const typeHandlers = handlers.get(envelope.type)

    console.debug(
      `[EventRouter] Dispatching ${envelope.type} to ${typeHandlers?.size || 0} handlers`,
    )

    if (!typeHandlers) return

    typeHandlers.forEach((genericHandler) => {
      try {
        // Safety: Handler type matches envelope type by design of .on()
        const specificHandler = genericHandler as unknown as (
          payload: typeof envelope.data,
        ) => void
        specificHandler(envelope.data)
      } catch (error) {
        console.error(
          `[EventRouter] Error in handler for ${envelope.type}:`,
          error,
        )
      }
    })
  },

  // Debug helper
  getListenerCount(type: ServerEventName) {
    return handlers.get(type)?.size || 0
  },
}

// --- Relay Listener ---
leaderElection.onRelay((payload) => {
  // Prevent cycles by flagging as fromRelay
  eventRouter.dispatch(payload as ServerMessageUnion, true)
})
