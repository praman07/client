/**
 * Handler: chat.message.reply
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatMessageReplyContract, ChatMessageReplyPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerChatMessageReplyHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatMessageReplyContract>(
    NotificationDownstreamEvent.ChatMessageReply,
    (event) => {
      const payload = event.payload as unknown as ChatMessageReplyPayload
      context.dispatch(addNotification({
        id: `reply-${payload.messageId}`,
        type: NotificationDownstreamEvent.ChatMessageReply,
        title: `${payload.actorName} replied to your message`,
        body: 'Someone replied to your message',
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { messageId: payload.messageId, conversationId: payload.conversationId },
      }))
    },
  )
}
