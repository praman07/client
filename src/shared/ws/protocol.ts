/**
 * WebSocket Protocol - LEGACY COMPATIBILITY
 *
 * This file provides backward compatibility for existing imports.
 * New code should import directly from:
 * - @/shared/ws/protocol/core-protocol (generic WS types)
 * - @/shared/contracts/chat/* (chat-specific types)
 *
 * @deprecated Use domain-specific contracts instead
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
export { ChatUpstreamEvent as ClientEventName } from '@/shared/contracts/chat/upstream'

// For event-router and event-bridge
// Note: ServerEventName is chat-specific and should be refactored
export const ServerEventName = {
  AckMessage: 'chat:ack-message',
  NewMessage: 'chat:new-message',
  MessageEdited: 'chat:message-edited',
  MessageDeleted: 'chat:message-deleted',
  ThreadMessage: 'chat:thread-message',
  ReactionAdded: 'chat:reaction-added',
  ReactionRemoved: 'chat:reaction-removed',
  MessageDelivered: 'chat:message-delivered',
  MessageRead: 'chat:message-read',
  ChannelRead: 'chat:channel-read',
  PresenceChanged: 'presence-changed',
  UserTyping: 'chat:user-typing',
  UserStopTyping: 'chat:user-stop-typing',
  ChannelRenamed: 'chat:channel-renamed',
  ChannelArchived: 'chat:channel-archived',
  SyncRequired: 'chat:sync-required',
  SubscribeAck: 'chat:subscribe-ack',
  Error: 'error',
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
  [ServerEventName.SubscribeAck]: import('@/shared/contracts/chat/downstream').SubscribeAckPayload
  // Add others as needed
}

export type ServerMessageUnion = {
  [K in ServerEventName]: import('./protocol/core-protocol').ServerMessage<
    ServerEventPayloads[K]
  >
}[ServerEventName]
