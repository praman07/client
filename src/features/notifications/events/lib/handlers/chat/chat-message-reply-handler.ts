/**
 * Handler: chat.message.reply
 * 
 * Uses the config-driven toast system for scalability.
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatMessageReplyContract, ChatMessageReplyPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'
import { showToastFromEvent } from '@/shared/ui/toast'

export function registerChatMessageReplyHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatMessageReplyContract>(
    NotificationDownstreamEvent.ChatMessageReply,
    (event) => {
      const payload = event.payload as unknown as ChatMessageReplyPayload
      const preview = payload.preview ?? ''
      
      // Show rich toast using config registry
      showToastFromEvent(NotificationDownstreamEvent.ChatMessageReply, payload)
      
      // Also update Redux notification state
      context.dispatch(addNotification({
        id: `reply-${payload.messageId}`,
        type: NotificationDownstreamEvent.ChatMessageReply,
        title: 'New reply',
        body: preview.slice(0, 100),
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: undefined,
        metadata: { messageId: payload.messageId, conversationId: payload.conversationId },
      }))
    },
  )
}
