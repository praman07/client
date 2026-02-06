/**
 * DOWNSTREAM CONTRACTS (Server → Client)
 * Domain: Chat
 * Source of Truth: Backend Message Entity
 */

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
  sequence?: number // Required for resequencer gap detection
}

export interface SyncRequiredPayload {
  conversationId: string
  reason: 'gap_too_large' | 'rebalance' | 'token_expired'
}

export interface MessageEditedPayload {
  messageId: string
  conversationId: string
  newContent: string
  editedAt: string
}

export interface MessageDeletedPayload {
  messageId: string
  conversationId: string
  deletedAt: string
}

export interface MessageReadPayload {
  conversationId: string
  messageId: string
  userId: string
  readAt: string
}

export interface MessageDeliveredPayload {
  conversationId: string
  messageId: string
  userId: string
  deliveredAt: string
}

export interface UserTypingPayload {
  conversationId: string
  userId: string
  isTyping: boolean
}

export interface SubscribeAckPayload {
  conversationId: string
  status: string
}

// ═══════════════════════════════════════════════════════════════
// EVENT TYPES
// ═══════════════════════════════════════════════════════════════

export interface NewMessageEvent {
  type: 'chat:new-message'
  payload: NewMessagePayload
}

export interface AckMessageEvent {
  type: 'chat:ack-message'
  payload: AckMessagePayload
}

export interface SyncRequiredEvent {
  type: 'chat:sync-required'
  payload: SyncRequiredPayload
}

export interface MessageReadEvent {
  type: 'chat:message-read'
  payload: MessageReadPayload
}

export interface MessageEditedEvent {
  type: 'chat:message-edited'
  payload: MessageEditedPayload
}

export interface MessageDeletedEvent {
  type: 'chat:message-deleted'
  payload: MessageDeletedPayload
}

export interface UserTypingEvent {
  type: 'chat:user-typing'
  payload: UserTypingPayload
}

export interface SubscribeAckEvent {
  type: 'chat:subscribe-ack'
  payload: SubscribeAckPayload
}

// Union of all Chat Downstream Events
export type ChatDownstreamEvent =
  | NewMessageEvent
  | AckMessageEvent
  | SyncRequiredEvent
  | MessageReadEvent
  | MessageEditedEvent
  | MessageDeletedEvent
  | UserTypingEvent
  | SubscribeAckEvent
