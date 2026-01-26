/**
 * UPSTREAM CONTRACTS (Client -> Server)
 * Domain: Chat
 */

export interface SendMessageCommand {
  type: 'chat:send-message'
  payload: {
    conversationId: string
    content: string
    dedupeId: string // Required for optimistic UI
    replyToId?: string
  }
}

export interface MarkReadCommand {
  type: 'chat:mark-read'
  payload: {
    conversationId: string
    messageIds: string[]
  }
}

export type ChatUpstreamEvent = SendMessageCommand | MarkReadCommand
