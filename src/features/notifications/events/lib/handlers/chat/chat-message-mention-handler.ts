/**
 * Handler: chat.message.mention
 * 
 * Uses the config-driven toast system for scalability.
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatMessageMentionContract, ChatMessageMentionPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'
import { showToastFromEvent } from '@/shared/ui/toast'

export function registerChatMessageMentionHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatMessageMentionContract>(
    NotificationDownstreamEvent.ChatMessageMention,
    (event) => {
      const payload = event.payload as unknown as ChatMessageMentionPayload
      
      // Show rich toast using config registry
      showToastFromEvent(NotificationDownstreamEvent.ChatMessageMention, payload)
      
      // Also update Redux notification state
      context.dispatch(addNotification({
        id: `mention-${payload.messageId}-${payload.mentionedUserId}`,
        type: NotificationDownstreamEvent.ChatMessageMention,
        title: 'You were mentioned',
        body: '@mention',
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: undefined,
        metadata: { conversationId: payload.conversationId, messageId: payload.messageId },
      }))
    },
  )
}
