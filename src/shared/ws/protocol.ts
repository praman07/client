// WebSocket Protocol v1.1
// Based on docs/architecture/chat/backend/websocket_protocol.md

// --- Envelopes ---

export type ProtocolEnvelope = ClientMessage | ServerMessageUnion // Use Union for stricter typing

export interface ClientMessage {
  id: string // Request ID
  type: ClientEventName
  payload: unknown
  headers?: {
    traceId?: string
  }
}

// Generic Interface (Internal Use)
export interface ServerMessage<T = unknown> {
  id?: string
  type: ServerEventName
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  meta?: {
    serverTimestamp: string // ISO 8601
  }
}

// Discriminated Union for Runtime Type Safety
export type ServerMessageUnion = {
  [K in ServerEventName]: ServerMessage<ServerEventPayloads[K]>
}[ServerEventName]

// --- Event Names ---

export enum ClientEventName {
  SendMessage = 'chat:send-message',
  EditMessage = 'chat:edit-message',
  DeleteMessage = 'chat:delete-message',
  SendThreadMessage = 'chat:send-thread-message',
  AddReaction = 'chat:add-reaction',
  RemoveReaction = 'chat:remove-reaction',
  MarkMessageRead = 'chat:mark-read',
  MarkMessageDelivered = 'chat:mark-delivered',
  MarkChannelRead = 'chat:mark-channel-read',
  SubscribeChannel = 'chat:subscribe-channel',
  UnsubscribeChannel = 'chat:unsubscribe-channel',
  SubscribeThread = 'chat:subscribe-thread',
  UnsubscribeThread = 'chat:unsubscribe-thread',
  UserTyping = 'chat:user-typing',
  UserStopTyping = 'chat:user-stop-typing',
  PresenceUpdate = 'presence-update',
  RequestMissingMessages = 'request-missing-messages',
  // Internal/System
  Ping = 'ping',
}

export enum ServerEventName {
  NewMessage = 'chat:new-message',
  MessageEdited = 'chat:message-edited',
  MessageDeleted = 'chat:message-deleted',
  ThreadMessage = 'chat:thread-message',
  ReactionAdded = 'chat:reaction-added',
  ReactionRemoved = 'chat:reaction-removed',
  MessageDelivered = 'chat:message-delivered',
  MessageRead = 'chat:message-read',
  ChannelRead = 'chat:channel-read',
  PresenceChanged = 'presence-changed',
  UserTyping = 'chat:user-typing',
  UserStopTyping = 'chat:user-stop-typing',
  ChannelRenamed = 'chat:channel-renamed',
  ChannelArchived = 'chat:channel-archived',
  SyncRequired = 'chat:sync-required',
  SubscribeAck = 'chat:subscribe-ack',
  Error = 'error',
  // Internal
  Pong = 'pong',
}

// --- Client Payloads ---

export interface SendMessagePayload {
  dedupeId: string
  conversationId: string
  content: string
  files?: Array<string>
  threadId?: string
}

export interface EditMessagePayload {
  messageId: string
  conversationId: string
  newContent: string
}

export interface DeleteMessagePayload {
  messageId: string
  conversationId: string
}

export interface AddReactionPayload {
  conversationId: string
  messageId: string
  emoji: string
  skinTone?: number
}

export interface RemoveReactionPayload {
  conversationId: string
  messageId: string
  emoji: string
}

export interface MarkMessageReadPayload {
  conversationId: string
  messageIds: Array<string>
}

export interface MarkMessageDeliveredPayload {
  conversationId: string
  messageIds: Array<string>
}

export interface MarkChannelReadPayload {
  conversationId: string
  watermarkId: string
}

export interface SubscribeChannelPayload {
  conversationId: string
}

export interface UnsubscribeChannelPayload {
  conversationId: string
}

export interface SubscribeThreadPayload {
  conversationId: string
  threadId: string
}

export interface UnsubscribeThreadPayload {
  conversationId: string
  threadId: string
}

export interface UserTypingPayload {
  conversationId: string
  threadId?: string
  isTyping: boolean
}

export interface RequestMissingMessagesPayload {
  conversationId: string
  afterStreamId: string
  limit?: number
}

// --- Server Payloads (Inbound) ---

export interface NewMessagePayload {
  messageId: string
  streamId: string
  dedupeId: string
  conversationId: string
  authorId: string
  content: string
  createdAt: string
  threadId?: string
}

export interface MessageDeliveredPayload {
  conversationId: string
  messageId: string
  userId: string
  deliveredAt: string
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

export interface ReactionUpdatePayload {
  conversationId: string
  messageId: string
  emoji: string
  userId: string
  count: number
}

export interface MessageReadPayload {
  conversationId: string
  messageId: string
  userId: string
  readAt: string
}

export interface ChannelReadPayload {
  conversationId: string
  userId: string
  watermarkId: string
}

export interface PresenceChangedPayload {
  userId: string
  status: 'online' | 'away' | 'offline'
  lastActive: string
}

export interface UserTypingServerPayload {
  conversationId: string
  userId: string
  isTyping: boolean
}

export interface ChannelRenamedPayload {
  conversationId: string
  newName: string
}

export interface ChannelArchivedPayload {
  conversationId: string
}

export interface SyncRequiredPayload {
  conversationId: string
  reason: 'gap_too_large' | 'rebalance' | 'token_expired'
}

export interface ErrorPayload {
  code: string
  message: string
  opId?: string
}

export interface SubscribeAckPayload {
  conversationId: string
  status: string
}

// --- Event Mapping ---

export type ClientEventPayloads = {
  [ClientEventName.SendMessage]: SendMessagePayload
  [ClientEventName.EditMessage]: EditMessagePayload
  [ClientEventName.DeleteMessage]: DeleteMessagePayload
  [ClientEventName.SendThreadMessage]: SendMessagePayload // Reuses SendMessage
  [ClientEventName.AddReaction]: AddReactionPayload
  [ClientEventName.RemoveReaction]: RemoveReactionPayload
  [ClientEventName.MarkMessageRead]: MarkMessageReadPayload
  [ClientEventName.MarkMessageDelivered]: MarkMessageDeliveredPayload
  [ClientEventName.MarkChannelRead]: MarkChannelReadPayload
  [ClientEventName.SubscribeChannel]: SubscribeChannelPayload
  [ClientEventName.UnsubscribeChannel]: UnsubscribeChannelPayload
  [ClientEventName.SubscribeThread]: SubscribeThreadPayload
  [ClientEventName.UnsubscribeThread]: UnsubscribeThreadPayload
  [ClientEventName.UserTyping]: UserTypingPayload
  [ClientEventName.UserStopTyping]: UserTypingPayload
  [ClientEventName.PresenceUpdate]: { status: 'online' | 'away' | 'offline' }
  [ClientEventName.RequestMissingMessages]: RequestMissingMessagesPayload
  [ClientEventName.Ping]: {}
}

export type ServerEventPayloads = {
  [ServerEventName.NewMessage]: NewMessagePayload
  [ServerEventName.MessageEdited]: MessageEditedPayload
  [ServerEventName.MessageDeleted]: MessageDeletedPayload
  [ServerEventName.ThreadMessage]: NewMessagePayload
  [ServerEventName.ReactionAdded]: ReactionUpdatePayload
  [ServerEventName.ReactionRemoved]: ReactionUpdatePayload
  [ServerEventName.MessageDelivered]: MessageDeliveredPayload
  [ServerEventName.MessageRead]: MessageReadPayload
  [ServerEventName.ChannelRead]: ChannelReadPayload
  [ServerEventName.PresenceChanged]: PresenceChangedPayload
  [ServerEventName.UserTyping]: UserTypingServerPayload
  [ServerEventName.UserStopTyping]: UserTypingServerPayload
  [ServerEventName.ChannelRenamed]: ChannelRenamedPayload
  [ServerEventName.ChannelArchived]: ChannelArchivedPayload
  [ServerEventName.SyncRequired]: SyncRequiredPayload
  [ServerEventName.SubscribeAck]: SubscribeAckPayload
  [ServerEventName.Error]: ErrorPayload
  [ServerEventName.Pong]: {}
}
