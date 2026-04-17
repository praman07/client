/**
 * Toast Data Enricher
 * 
 * Enriches raw event payloads with data from TanStack Query cache.
 * No API calls - uses existing cached state only.
 */

import { resolveConversationFromCache, resolveUserFromCache } from './resolver'
import type { ToastData, ToastUser } from './types'
import type { ChatMessageMentionPayload, ChatMessageNewPayload, ChatMessageReplyPayload } from '@/shared/contracts/notification/downstream'

/**
 * Get actor info from cache (TanStack Query → Redux → fallback)
 */
export function getActorFromCache(conversationId: string, actorId: string): ToastUser {
  const user = resolveUserFromCache(conversationId, actorId)
  return {
    id: user.id,
    name: user.fullName,
    avatarUrl: user.avatarUrl,
  }
}

/**
 * Get conversation name from cache
 */
export function getConversationName(conversationId: string): string {
  const conv = resolveConversationFromCache(conversationId)
  return conv.name
}

/**
 * Get conversation type from cache
 */
export function getConversationType(conversationId: string): string {
  const conv = resolveConversationFromCache(conversationId)
  return conv.type
}

/**
 * Enrich chat.message.new event
 */
export function enrichChatMessageNew(payload: ChatMessageNewPayload): ToastData {
  const actor = getActorFromCache(payload.conversationId, payload.actorId)
  const convName = getConversationName(payload.conversationId)
  const preview = payload.preview ?? ''
  
  return {
    id: `msg-new-${payload.messageId}`,
    variant: 'default',
    duration: 5000,
    title: `${actor.name} sent a message`,
    subtitle: convName,
    body: preview.slice(0, 80),
    user: actor,
    navigation: {
      type: 'conversation',
      id: payload.conversationId,
    },
    timestamp: new Date().toISOString(),
  }
}

/**
 * Enrich chat.message.mention event
 */
export function enrichChatMention(payload: ChatMessageMentionPayload): ToastData {
  const actor = getActorFromCache(payload.conversationId, payload.actorId)
  const convName = getConversationName(payload.conversationId)
  const preview = (payload as any).preview ?? '@mention'
  
  return {
    id: `mention-${payload.messageId}-${payload.mentionedUserId}`,
    variant: 'mention',
    duration: 7000,
    title: `${actor.name} mentioned you`,
    subtitle: convName,
    body: preview !== '@mention' ? preview.slice(0, 80) : undefined,
    user: actor,
    navigation: {
      type: 'conversation',
      id: payload.conversationId,
    },
    timestamp: new Date().toISOString(),
  }
}

/**
 * Enrich chat.message.reply event
 */
export function enrichChatReply(payload: ChatMessageReplyPayload): ToastData {
  const actor = getActorFromCache(payload.conversationId, payload.actorId)
  const convName = getConversationName(payload.conversationId)
  const preview = payload.preview ?? ''
  
  return {
    id: `reply-${payload.messageId}`,
    variant: 'reply',
    duration: 6000,
    title: `${actor.name} replied to your message`,
    subtitle: convName,
    body: preview.slice(0, 80),
    user: actor,
    navigation: {
      type: 'thread',
      id: payload.parentMessageId,
      params: { conversationId: payload.conversationId },
    },
    timestamp: new Date().toISOString(),
  }
}

/**
 * Enrich issue.assigned event (example for extensibility)
 */
export function enrichIssueAssigned(
  payload: { issueId: string; issueTitle: string; assigneeId: string; assignerId: string; conversationId?: string }
): ToastData {
  const assigner = getActorFromCache(payload.conversationId ?? '', payload.assignerId)
  
  return {
    id: `issue-assigned-${payload.issueId}-${Date.now()}`,
    variant: 'default',
    duration: 6000,
    title: `${assigner.name} assigned you to an issue`,
    subtitle: 'Issue Tracker',
    body: payload.issueTitle,
    timestamp: new Date().toISOString(),
  }
}
