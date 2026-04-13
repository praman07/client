/**
 * Handler: chat.thread.reply
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatThreadReplyContract, ChatThreadReplyPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerChatThreadReplyHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatThreadReplyContract>(
    NotificationDownstreamEvent.ChatThreadReply,
    (event) => {
      const payload = event.payload as unknown as ChatThreadReplyPayload
      context.dispatch(addNotification({
        id: `thread-reply-${payload.threadId}`,
        type: NotificationDownstreamEvent.ChatThreadReply,
        title: `${payload.actorName} replied to your thread`,
        body: 'Someone replied in a thread you follow',
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { threadId: payload.threadId, conversationId: payload.conversationId },
      }))
    },
  )
}
