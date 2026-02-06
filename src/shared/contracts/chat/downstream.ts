/**
 * Chat Downstream Contracts (Server → Client)
 * All server-sent WebSocket events
 */

import type { DownstreamContract } from '../types'
import { ChatDownstreamEvent } from './events'

// ═══════════════════════════════════════════════════════════════
// PAYLOADS
// ═══════════════════════════════════════════════════════════════

export interface NewMessagePayload {
  messageId: string
  streamId: string
  dedupeId: string
  conversationId: string
  authorId: string
  content: string
  createdAt: string
  sequence: number
  threadId?: string
  meta?: {
    replay?: boolean
  }
}

export interface AckMessagePayload {
  dedupeId: string
  status: 'pending' | 'sent' | 'failed' | 'duplicate'
  message?: string
  streamId?: string
  sequence?: number
  messageId?: string
}

export interface SyncRequiredPayload {
  conversationId: string
  reason: string
}

export interface MessageEditedPayload {
  messageId: string
  conversationId: string
  content: string
  editedAt: string
  authorId: string
}

export interface MessageDeletedPayload {
  messageId: string
  conversationId: string
  deletedAt: string
  authorId: string
}

export interface MessageReadPayload {
  conversationId: string
  userId: string
  messageIds: string[]
  readAt: string
}

export interface MessageDeliveredPayload {
  conversationId: string
  userId: string
  messageIds: string[]
  deliveredAt: string
}

export interface UserTypingPayload {
  conversationId: string
  userId: string
  isTyping: boolean
}

export interface SubscribeAckPayload {
  conversationId: string
  success: boolean
}

// ═══════════════════════════════════════════════════════════════
// CONTRACTS
// ═══════════════════════════════════════════════════════════════

export type NewMessageContract = DownstreamContract<
  ChatDownstreamEvent.NewMessage,
  NewMessagePayload
>

export type AckMessageContract = DownstreamContract<
  ChatDownstreamEvent.AckMessage,
  AckMessagePayload
>

export type SyncRequiredContract = DownstreamContract<
  ChatDownstreamEvent.SyncRequired,
  SyncRequiredPayload
>

export type MessageEditedContract = DownstreamContract<
  ChatDownstreamEvent.MessageEdited,
  MessageEditedPayload
>

export type MessageDeletedContract = DownstreamContract<
  ChatDownstreamEvent.MessageDeleted,
  MessageDeletedPayload
>

export type MessageReadContract = DownstreamContract<
  ChatDownstreamEvent.MessageRead,
  MessageReadPayload
>

export type MessageDeliveredContract = DownstreamContract<
  ChatDownstreamEvent.MessageDelivered,
  MessageDeliveredPayload
>

export type UserTypingContract = DownstreamContract<
  ChatDownstreamEvent.UserTyping,
  UserTypingPayload
>

export type SubscribeAckContract = DownstreamContract<
  ChatDownstreamEvent.SubscribeAck,
  SubscribeAckPayload
>

// ═══════════════════════════════════════════════════════════════
// UNION TYPE
// ═══════════════════════════════════════════════════════════════

export type ChatDownstreamContract =
  | NewMessageContract
  | AckMessageContract
  | SyncRequiredContract
  | MessageEditedContract
  | MessageDeletedContract
  | MessageReadContract
  | MessageDeliveredContract
  | UserTypingContract
  | SubscribeAckContract

// ═══════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY - Event type aliases
// ═══════════════════════════════════════════════════════════════

export type NewMessageEvent = NewMessageContract
export type AckMessageEvent = AckMessageContract
export type SyncRequiredEvent = SyncRequiredContract
export type MessageEditedEvent = MessageEditedContract
export type MessageDeletedEvent = MessageDeletedContract
export type MessageReadEvent = MessageReadContract
export type MessageDeliveredEvent = MessageDeliveredContract
export type UserTypingEvent = UserTypingContract
export type SubscribeAckEvent = SubscribeAckContract
