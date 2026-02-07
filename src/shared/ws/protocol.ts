/*
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                    ⚠️  DEPRECATED FILE  ⚠️                    ║
 * ║                                                               ║
 * ║  This file will be removed in v2.0.0                         ║
 * ║  Migrate to: @/shared/contracts/registry                     ║
 * ║                                                               ║
 * ║  See migration guide below                                   ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

/**
 * WebSocket Protocol - LEGACY COMPATIBILITY
 *
 * @deprecated This file is deprecated and will be removed in v2.0.0
 *
 * ## Migration Guide
 *
 * ### Before (Old Approach):
 * ```typescript
 * import { ServerEventName } from '@/shared/ws/protocol'
 *
 * registerHandler(ServerEventName.NewMessage, async (event) => {
 *   // handle event
 * })
 * ```
 *
 * ### After (New Approach - Option 1: Direct Import):
 * ```typescript
 * import { ChatDownstreamEvent } from '@/shared/contracts/chat/events'
 *
 * registerHandler(ChatDownstreamEvent.NewMessage, async (event) => {
 *   // handle event
 * })
 * ```
 *
 * ### After (New Approach - Option 2: Registry Namespace):
 * ```typescript
 * import { Chat } from '@/shared/contracts/registry'
 *
 * registerHandler(Chat.Events.Downstream.NewMessage, async (event) => {
 *   // handle event
 * })
 * ```
 *
 * ## Benefits of New Registry
 * - ✅ Type-safe event names with autocomplete
 * - ✅ Domain-organized (chat, whiteboard, presence)
 * - ✅ Single source of truth
 * - ✅ Better IDE support
 * - ✅ Easier to discover available events
 *
 * @see {@link file://./contracts/registry.ts} for the new centralized registry
 * @see {@link file://./contracts/chat/events.ts} for chat event enums
 */

// Re-export core protocol
export * from './protocol/core-protocol'

// Re-export chat contracts for backward compatibility
// These will be gradually migrated to direct imports
export type {
  NewMessagePayload,
  AckMessagePayload,
  SyncRequiredPayload,
} from '@/shared/contracts/chat/downstream'

// For send-message.ts and other upstream uses
/**
 * @deprecated Use ChatUpstreamEvent from @/shared/contracts/chat/events instead
 * @see {@link file://./contracts/chat/events.ts}
 */
export { ChatUpstreamEvent as ClientEventName } from '@/shared/contracts/chat/upstream'

/**
 * Server Event Names - DEPRECATED
 *
 * @deprecated Use ChatDownstreamEvent enum from @/shared/contracts/chat/events
 *
 * Migration example:
 * ```typescript
 * // Before
 * ServerEventName.NewMessage
 *
 * // After
 * import { ChatDownstreamEvent } from '@/shared/contracts/chat/events'
 * ChatDownstreamEvent.NewMessage
 * ```
 */
export const ServerEventName = {
  /** @deprecated Use ChatDownstreamEvent.AckMessage */
  AckMessage: 'chat:ack-message',
  /** @deprecated Use ChatDownstreamEvent.NewMessage */
  NewMessage: 'chat:new-message',
  /** @deprecated Use ChatDownstreamEvent.MessageEdited */
  MessageEdited: 'chat:message-edited',
  /** @deprecated Use ChatDownstreamEvent.MessageDeleted */
  MessageDeleted: 'chat:message-deleted',
  /** @deprecated Use ChatDownstreamEvent.ThreadMessage */
  ThreadMessage: 'chat:thread-message',
  /** @deprecated Use ChatDownstreamEvent.ReactionAdded */
  ReactionAdded: 'chat:reaction-added',
  /** @deprecated Use ChatDownstreamEvent.ReactionRemoved */
  ReactionRemoved: 'chat:reaction-removed',
  /** @deprecated Use ChatDownstreamEvent.MessageDelivered */
  MessageDelivered: 'chat:message-delivered',
  /** @deprecated Use ChatDownstreamEvent.MessageRead */
  MessageRead: 'chat:message-read',
  /** @deprecated Use ChatDownstreamEvent.ChannelRead */
  ChannelRead: 'chat:channel-read',
  /** @deprecated Use PresenceDownstreamEvent when available */
  PresenceChanged: 'presence-changed',
  /** @deprecated Use ChatDownstreamEvent.UserTyping */
  UserTyping: 'chat:user-typing',
  /** @deprecated Use ChatDownstreamEvent.UserStopTyping */
  UserStopTyping: 'chat:user-stop-typing',
  /** @deprecated Use ChatDownstreamEvent.ChannelRenamed */
  ChannelRenamed: 'chat:channel-renamed',
  /** @deprecated Use ChatDownstreamEvent.ChannelArchived */
  ChannelArchived: 'chat:channel-archived',
  /** @deprecated Use ChatDownstreamEvent.SyncRequired */
  SyncRequired: 'chat:sync-required',
  /** @deprecated Use ChatDownstreamEvent.SubscribeSuccess */
  SubscribeSuccess: 'chat:subscribe-success',
  /** @deprecated Use core error handling */
  Error: 'error',
  /** @deprecated Use core protocol */
  Pong: 'pong',
} as const

export type ServerEventName =
  (typeof ServerEventName)[keyof typeof ServerEventName]

// For backward compatibility with mapped types
export interface ServerEventPayloads {
  [ServerEventName.AckMessage]: import('@/shared/contracts/chat/downstream').AckMessagePayload
  [ServerEventName.NewMessage]: import('@/shared/contracts/chat/downstream').NewMessagePayload
  [ServerEventName.SyncRequired]: import('@/shared/contracts/chat/downstream').SyncRequiredPayload
  [ServerEventName.MessageRead]: import('@/shared/contracts/chat/downstream').MessageReadPayload
  [ServerEventName.MessageEdited]: import('@/shared/contracts/chat/downstream').MessageEditedPayload
  [ServerEventName.MessageDeleted]: import('@/shared/contracts/chat/downstream').MessageDeletedPayload
  [ServerEventName.UserTyping]: import('@/shared/contracts/chat/downstream').UserTypingPayload
  [ServerEventName.SubscribeSuccess]: import('@/shared/contracts/chat/downstream').SubscribeSuccessPayload
  // Add others as needed
}

export type ServerMessageUnion = {
  [K in ServerEventName]: import('./protocol/core-protocol').ServerMessage<
    ServerEventPayloads[K]
  >
}[ServerEventName]
