/**
 * UPSTREAM CONTRACTS (Client -> Server)
 * Domain: Chat
 */

// Event enum for backward compatibility with protocol.ts
export enum ChatUpstreamEvent {
  SendMessage = 'chat:send-message',
  EditMessage = 'chat:edit-message',
  DeleteMessage = 'chat:delete-message',
  SendThreadMessage = 'chat:send-thread-message',
  AddReaction = 'chat:add-reaction',
  RemoveReaction = 'chat:remove-reaction',
  MarkMessageRead = 'chat:mark-read',
  MarkMessageDelivered = 'chat:mark-delivered',
  MarkChannelRead = 'chat:mark-channel-read',
  SubscribeConversation = 'chat:subscribe-conversation',
  UnsubscribeConversation = 'chat:unsubscribe-conversation',
  SubscribeThread = 'chat:subscribe-thread',
  UnsubscribeThread = 'chat:unsubscribe-thread',
  UserTyping = 'chat:user-typing',
  UserStopTyping = 'chat:user-stop-typing',
  Ping = 'chat:ping',
}

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
    messageIds: Array<string>
  }
}

export type ChatUpstreamCommand = SendMessageCommand | MarkReadCommand
