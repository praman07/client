/**
 * Chat Domain Contracts - Public API
 * Single import point for all chat-related types
 */

// Event names
// ═══════════════════════════════════════════════════════════════
// CONVENIENCE NAMESPACES
// ═══════════════════════════════════════════════════════════════

import { ChatDownstreamEvent, ChatUpstreamEvent } from './events'

export {
  ChatUpstreamEvent,
  ChatDownstreamEvent,
  type ChatEvent,
} from './events'

// Upstream (Client → Server)
export type {
  SendMessagePayload,
  EditMessagePayload,
  DeleteMessagePayload,
  AddReactionPayload,
  RemoveReactionPayload,
  MarkReadPayload,
  SubscribePayload,
  TypingPayload,
  SendMessageContract,
  EditMessageContract,
  DeleteMessageContract,
  AddReactionContract,
  RemoveReactionContract,
  MarkReadContract,
  SubscribeContract,
  TypingContract,
  ChatUpstreamContract,
} from './upstream'

// Downstream (Server → Client)
export type {
  NewMessagePayload,
  AckMessagePayload,
  SyncRequiredPayload,
  MessageEditedPayload,
  MessageDeletedPayload,
  MessageReadPayload,
  MessageDeliveredPayload,
  UserTypingPayload,
  SubscribeSuccessPayload,
  NewMessageContract,
  AckMessageContract,
  SyncRequiredContract,
  MessageEditedContract,
  MessageDeletedContract,
  MessageReadContract,
  MessageDeliveredContract,
  UserTypingContract,
  SubscribeSuccessContract,
  ChatDownstreamContract,
} from './downstream'

/**
 * Namespace for chat event names
 * @example Chat.Events.Downstream.NewMessage
 */
export const Events = {
  Upstream: ChatUpstreamEvent,
  Downstream: ChatDownstreamEvent,
} as const
