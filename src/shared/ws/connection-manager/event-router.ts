import type {
  ServerEventName,
  ServerEventPayloads,
  ServerMessageUnion,
} from './protocol'

// We use 'never' to signal that the stored handler's argument type is not known at the container level.
// This forces us to be careful when casting it back out.
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

    // Safety: We force-cast to GenericEventHandler for storage.
    // This is valid 'unknown' usage effectively.
    typeHandlers.add(handler as unknown as GenericEventHandler)

    // Unsubscribe
    return () => {
      typeHandlers.delete(handler as unknown as GenericEventHandler)
    }
  },

  dispatch(envelope: ServerMessageUnion) {
    const typeHandlers = handlers.get(envelope.event)
    if (!typeHandlers) return

    typeHandlers.forEach((genericHandler) => {
      try {
        // Safety: We cast the GenericEventHandler back to the specific type required by this envelope.
        // The correctness is guaranteed by the fact that 'handlers.get(envelope.event)' ONLY contains
        // handlers registered via 'on(envelope.event, ...)' which matches the payload type.
        const specificHandler = genericHandler as unknown as (
          payload: typeof envelope.payload,
        ) => void
        specificHandler(envelope.payload)
      } catch (error) {
        console.error(
          `[EventRouter] Error in handler for ${envelope.event}:`,
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
