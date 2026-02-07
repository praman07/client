/**
 * Chat Event Names - Single Source of Truth
 * All event identifiers for the chat domain
 */

// ═══════════════════════════════════════════════════════════════
// UPSTREAM EVENTS (Client → Server)
// ═══════════════════════════════════════════════════════════════

export enum ChatUpstreamEvent {
  SendMessage = 'chat:send-message',
  EditMessage = 'chat:edit-message',
  DeleteMessage = 'chat:delete-message',

  SendThreadMessage = 'chat:send-thread-message',

  AddReaction = 'chat:add-reaction',
  RemoveReaction = 'chat:remove-reaction',

  MarkRead = 'chat:mark-read',
  MarkDelivered = 'chat:mark-delivered',
  MarkChannelRead = 'chat:mark-channel-read',

  Subscribe = 'chat:subscribe-conversation',
  Unsubscribe = 'chat:unsubscribe-conversation',

  SubscribeThread = 'chat:subscribe-thread',
  UnsubscribeThread = 'chat:unsubscribe-thread',

  StartTyping = 'chat:typography-start',
  StopTyping = 'chat:user-stop-typing',

  Ping = 'chat:ping',
}

// ═══════════════════════════════════════════════════════════════
// DOWNSTREAM EVENTS (Server → Client)
// ═══════════════════════════════════════════════════════════════

export enum ChatDownstreamEvent {
  NewMessage = 'chat:new-message',
  AckMessage = 'chat:ack-message',

  MessageEdited = 'chat:message-edited',
  MessageDeleted = 'chat:message-deleted',

  ThreadMessage = 'chat:thread-message',

  ReactionAdded = 'chat:reaction-added',
  ReactionRemoved = 'chat:reaction-removed',

  MessageRead = 'chat:message-read',
  MessageDelivered = 'chat:message-delivered',
  ChannelRead = 'chat:channel-read',

  UserTyping = 'chat:user-typing',

  ChannelRenamed = 'chat:channel-renamed',
  ChannelArchived = 'chat:channel-archived',

  SyncRequired = 'chat:sync-required',
  SubscribeSuccess = 'chat:subscribe-success',

  Pong = 'chat:pong',
}

// ═══════════════════════════════════════════════════════════════
// UNION TYPES
// ═══════════════════════════════════════════════════════════════

export type ChatEvent = ChatUpstreamEvent | ChatDownstreamEvent
