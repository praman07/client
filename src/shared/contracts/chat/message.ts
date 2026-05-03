/**
 * Core Message Type for Local Storage
 *
 * This is the canonical shape for messages stored in IndexedDB
 * and used by chat-related widgets. It maps closely to ChatMessage
 * from GraphQL but is optimized for local operations.
 *
 * ChatAttachment is defined here (not in upstream/downstream) because
 * it is part of the Message entity — both storage and rendering layers
 * need to reference it without circular imports.
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

/**
 * A Vault file attachment embedded in a chat message.
 *
 * fileId is the permanent Vault reference — never expires.
 * url is a short-lived presigned GET URL (1-hour TTL):
 *   - Present only in live WS events for immediate rendering
 *   - DO NOT store url in IndexedDB — only store fileId, name, mimeType, sizeBytes
 *   - Refresh via getDownloadUrl(fileId) using React Query (4-min stale time)
 */
export interface ChatAttachment {
  /** Vault fileId — permanent reference, never expires */
  fileId: string
  name: string
  mimeType: string
  /** File size in bytes */
  sizeBytes: number
  /**
   * Short-lived presigned GET URL (1-hour TTL).
   * Only present in live WS events. DO NOT persist to IndexedDB or YJS.
   */
  url?: string
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
  isEdited?: boolean
  deletedAt?: string
  parentMessageId?: string
  replyCount?: number
  deliveryStatus?: DeliveryStatus
  reactions?: Array<MessageReaction>
  /**
   * Optional rich media attachments.
   * Present only when the sender attached files via the Vault pipeline.
   * Rendering: map over attachments, check mimeType, render image/video/file card.
   */
  metadata?: {
    attachments?: Array<ChatAttachment>
  }
}
