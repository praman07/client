import type { ChatDownstreamEvent } from '@/shared/contracts/chat/downstream'
import { eventRouter } from '@/shared/ws/event-router'
import { ServerEventName } from '@/shared/ws/protocol'
import { dispatchEvent } from '@/shared/ws/event-bus'

/**
 * Domain Event Bridge
 * Responsibilities:
 * 1. Subscribe to transport-layer events via EventRouter.
 * 2. Map/Forward them to the Domain Event Bus (features).
 *
 * This keeps the EventRouter unaware of domain concerns.
 */

const CHAT_EVENTS = [
  ServerEventName.AckMessage,
  ServerEventName.NewMessage,
  ServerEventName.MessageEdited,
  ServerEventName.MessageDeleted,
  ServerEventName.ThreadMessage,
  ServerEventName.ReactionAdded,
  ServerEventName.ReactionRemoved,
  ServerEventName.MessageDelivered,
  ServerEventName.MessageRead,
  ServerEventName.ChannelRead,
  ServerEventName.UserTyping,
  ServerEventName.UserStopTyping,
  ServerEventName.ChannelRenamed,
  ServerEventName.ChannelArchived,
  ServerEventName.SyncRequired,
  ServerEventName.SubscribeAck,
]

export function initializeDomainBridge() {
  console.log('[EventBridge] Initializing Domain Bridge')

  const unsubs: Array<() => void> = []

  // Register Chat Events
  CHAT_EVENTS.forEach((eventName) => {
    const unsub = eventRouter.on(eventName, (payload) => {
      // Forward to Domain Event Bus
      dispatchEvent({
        type: eventName as any, // Validated by contract in dispatchEvent
        payload,
      } as ChatDownstreamEvent)
    })
    unsubs.push(unsub)
  })

  return () => {
    console.log('[EventBridge] Teardown')
    unsubs.forEach((u) => u())
  }
}
