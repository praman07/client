/**
 * Core Message Type for Local Storage
 *
 * This is the canonical shape for messages stored in IndexedDB
 * and used by chat-related widgets. It maps closely to ChatMessage
 * from GraphQL but is optimized for local operations.
 */

export type DeliveryStatus =
  | 'pending'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'

export interface MessageReaction {
  emoji: string
  count: number
  hasReacted: boolean
}

export interface Message {
  id: string
  streamId: string
  conversationId: string
  authorId: string
  content: string
  type: string
  createdAt: string
  updatedAt?: string
  editedAt?: string
  deletedAt?: string
  parentMessageId?: string
  replyCount?: number
  deliveryStatus?: DeliveryStatus
  reactions?: Array<MessageReaction>
}
