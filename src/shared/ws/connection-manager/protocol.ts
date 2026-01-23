// WebSocket Protocol v1.1
// Based on docs/architecture/chat/backend/websocket_protocol.md

// --- Envelopes ---

export type ProtocolEnvelope = ClientMessage | ServerMessageUnion // Use Union for stricter typing

export interface ClientMessage {
  event: ClientEventName
  payload: unknown
  headers?: {
    traceId?: string
  }
}

// Generic Interface (Internal Use)
export interface ServerMessage<T = unknown> {
  event: ServerEventName
  payload: T
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
  SendMessage = 'send-message',
  EditMessage = 'edit-message',
  DeleteMessage = 'delete-message',
  SendThreadMessage = 'send-thread-message',
  AddReaction = 'add-reaction',
  RemoveReaction = 'remove-reaction',
  MarkMessageRead = 'mark-message-read',
  MarkMessageDelivered = 'mark-message-delivered',
  MarkChannelRead = 'mark-channel-read',
  SubscribeChannel = 'subscribe-channel',
  UnsubscribeChannel = 'unsubscribe-channel',
  SubscribeThread = 'subscribe-thread',
  UnsubscribeThread = 'unsubscribe-thread',
  UserTyping = 'user-typing',
  UserStopTyping = 'user-stop-typing',
  PresenceUpdate = 'presence-update',
  RequestMissingMessages = 'request-missing-messages',
  // Internal/System
  Ping = 'ping',
}

export enum ServerEventName {
  NewMessage = 'new-message',
  MessageEdited = 'message-edited',
  MessageDeleted = 'message-deleted',
  ThreadMessage = 'thread-message',
  ReactionAdded = 'reaction-added',
  ReactionRemoved = 'reaction-removed',
  MessageDelivered = 'message-delivered',
  MessageRead = 'message-read',
  ChannelRead = 'channel-read',
  PresenceChanged = 'presence-changed',
  UserTyping = 'user-typing',
  UserStopTyping = 'user-stop-typing',
  ChannelRenamed = 'channel-renamed',
  ChannelArchived = 'channel-archived',
  SyncRequired = 'sync-required',
  Error = 'error',
  // Internal
  Pong = 'pong',
}

// --- Client Payloads ---

export interface SendMessagePayload {
  dedupeId: string
  channelId: string
  content: string
  files?: Array<string>
  threadId?: string
}

export interface EditMessagePayload {
  messageId: string
  channelId: string
  newContent: string
}

export interface DeleteMessagePayload {
  messageId: string
  channelId: string
}

export interface AddReactionPayload {
  channelId: string
  messageId: string
  emoji: string
  skinTone?: number
}

export interface RemoveReactionPayload {
  channelId: string
  messageId: string
  emoji: string
}

export interface MarkMessageReadPayload {
  channelId: string
  messageIds: Array<string>
}

export interface MarkMessageDeliveredPayload {
  channelId: string
  messageIds: Array<string>
}

export interface MarkChannelReadPayload {
  channelId: string
  watermarkId: string
}

export interface SubscribeChannelPayload {
  channelId: string
}

export interface UnsubscribeChannelPayload {
  channelId: string
}

export interface SubscribeThreadPayload {
  channelId: string
  threadId: string
}

export interface UnsubscribeThreadPayload {
  channelId: string
  threadId: string
}

export interface UserTypingPayload {
  channelId: string
  threadId?: string
  isTyping: boolean
}

export interface RequestMissingMessagesPayload {
  channelId: string
  afterStreamId: string
  limit?: number
}

// --- Server Payloads (Inbound) ---

export interface NewMessagePayload {
  messageId: string
  streamId: string
  dedupeId: string
  channelId: string
  authorId: string
  content: string
  createdAt: string
  threadId?: string
}

export interface MessageDeliveredPayload {
  channelId: string
  messageId: string
  userId: string
  deliveredAt: string
}

export interface MessageEditedPayload {
  messageId: string
  channelId: string
  newContent: string
  editedAt: string
}

export interface MessageDeletedPayload {
  messageId: string
  channelId: string
  deletedAt: string
}

export interface ReactionUpdatePayload {
  channelId: string
  messageId: string
  emoji: string
  userId: string
  count: number
}

export interface MessageReadPayload {
  channelId: string
  messageId: string
  userId: string
  readAt: string
}

export interface ChannelReadPayload {
  channelId: string
  userId: string
  watermarkId: string
}

export interface PresenceChangedPayload {
  userId: string
  status: 'online' | 'away' | 'offline'
  lastActive: string
}

export interface UserTypingServerPayload {
  channelId: string
  userId: string
  isTyping: boolean
}

export interface ChannelRenamedPayload {
  channelId: string
  newName: string
}

export interface ChannelArchivedPayload {
  channelId: string
}

export interface SyncRequiredPayload {
  channelId: string
  reason: 'gap_too_large' | 'rebalance' | 'token_expired'
}

export interface ErrorPayload {
  code: string
  message: string
  opId?: string
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
  [ServerEventName.Error]: ErrorPayload
  [ServerEventName.Pong]: {}
}
