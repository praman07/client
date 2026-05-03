/**
 * Chat Upstream Contracts (Client → Server)
 * All client-initiated WebSocket commands
 */

import { ChatUpstreamEvent } from './events'
import type { UpstreamContract } from '../types'
import type { ChatAttachment } from './message'

// Re-export event enum for convenience
export { ChatUpstreamEvent }

// ═══════════════════════════════════════════════════════════════
// PAYLOADS
// ═══════════════════════════════════════════════════════════════

export interface SendMessagePayload {
  conversationId: string
  content: string
  dedupeId: string
  parentMessageId?: string
  /**
   * Optional Vault attachments sent with this message.
   * Must be uploaded and confirmed via Vault pipeline BEFORE calling sendMessage.
   * Server stores in ChatMessage.metadata (Json?) — propagated through stream-worker.
   */
  metadata?: {
    attachments?: Array<ChatAttachment>
  }
}

export interface EditMessagePayload {
  messageId: string
  content: string
}

export interface DeleteMessagePayload {
  messageId: string
}

export interface AddReactionPayload {
  messageId: string
  emoji: string
}

export interface RemoveReactionPayload {
  messageId: string
  emoji: string
}

export interface MarkReadPayload {
  conversationId: string
  messageIds: Array<string>
}

export interface SubscribePayload {
  conversationId: string
}

export interface TypingPayload {
  conversationId: string
}

// ═══════════════════════════════════════════════════════════════
// CONTRACTS
// ═══════════════════════════════════════════════════════════════

export type SendMessageContract = UpstreamContract<
  ChatUpstreamEvent.SendMessage,
  SendMessagePayload
>

export type EditMessageContract = UpstreamContract<
  ChatUpstreamEvent.EditMessage,
  EditMessagePayload
>

export type DeleteMessageContract = UpstreamContract<
  ChatUpstreamEvent.DeleteMessage,
  DeleteMessagePayload
>

export type AddReactionContract = UpstreamContract<
  ChatUpstreamEvent.AddReaction,
  AddReactionPayload
>

export type RemoveReactionContract = UpstreamContract<
  ChatUpstreamEvent.RemoveReaction,
  RemoveReactionPayload
>

export type MarkReadContract = UpstreamContract<
  ChatUpstreamEvent.MarkRead,
  MarkReadPayload
>

export type SubscribeContract = UpstreamContract<
  ChatUpstreamEvent.Subscribe,
  SubscribePayload
>

export type TypingContract = UpstreamContract<
  ChatUpstreamEvent.StartTyping,
  TypingPayload
>

// ═══════════════════════════════════════════════════════════════
// UNION TYPE
// ═══════════════════════════════════════════════════════════════

export type ChatUpstreamContract =
  | SendMessageContract
  | EditMessageContract
  | DeleteMessageContract
  | AddReactionContract
  | RemoveReactionContract
  | MarkReadContract
  | SubscribeContract
  | TypingContract

// ═══════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY - Command type aliases
// ═══════════════════════════════════════════════════════════════

export type SendMessageCommand = SendMessageContract
export type MarkReadCommand = MarkReadContract
