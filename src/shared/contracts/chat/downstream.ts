/**
 * Chat Downstream Contracts (Server → Client)
 * All server-sent WebSocket events
 */

import type { ChatDownstreamEvent } from './events'
import type { DownstreamContract } from '../types'

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
  parentMessageId?: string
  threadId?: string
  meta?: {
    replay?: boolean
  }
  projectId?: string
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
  messageIds: Array<string>
  readAt: string
}

export interface MessageDeliveredPayload {
  conversationId: string
  userId: string
  messageIds: Array<string>
  deliveredAt: string
}

export interface UserTypingPayload {
  conversationId: string
  userId: string
  isTyping: boolean
}

export interface SubscribeSuccessPayload {
  conversationId: string
  conversationType: 'CHANNEL' | 'DM' | 'GROUP_DM' | 'THREAD'
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

export type SubscribeSuccessContract = DownstreamContract<
  ChatDownstreamEvent.SubscribeSuccess,
  SubscribeSuccessPayload
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
  | SubscribeSuccessContract

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
export type SubscribeSuccessEvent = SubscribeSuccessContract
