/**
 * DOWNSTREAM CONTRACTS (Server -> Client)
 * Domain: Chat
 * Source of Truth: Backend Message Entity
 */

// We don't import implementation types here to keep contracts pure.
// We define the shape explicitly.

export interface MessagePayload {
  messageId: string
  conversationId: string
  streamId: string
  content: string
  authorId: string
  createdAt: string // ISO
  dedupeId?: string
  // Add other fields as they become stable
  replyToId?: string | null
  isEdited?: boolean
  isDeleted?: boolean
}

export interface NewMessageEvent {
  type: 'chat:new-message'
  payload: MessagePayload
}

export interface MessageReadEvent {
  type: 'chat:message-read'
  payload: {
    conversationId: string
    messageId: string
    userId: string
    readAt: string
  }
}

export interface AckMessageEvent {
  type: 'chat:ack-message'
  payload: {
    dedupeId: string
    status: 'pending' | 'sent' | 'failed' | 'duplicate'
    message?: string
    streamId?: string
  }
}

export interface SyncRequiredEvent {
  type: 'chat:sync-required'
  payload: {
    conversationId: string
    reason: string
  }
}

// Union of all Chat Downstream Events
export type ChatDownstreamEvent =
  | NewMessageEvent
  | MessageReadEvent
  | AckMessageEvent
  | SyncRequiredEvent
