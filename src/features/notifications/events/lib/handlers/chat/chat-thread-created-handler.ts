/**
 * Handler: chat.thread.created
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatThreadCreatedContract, ChatThreadCreatedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerChatThreadCreatedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatThreadCreatedContract>(
    NotificationDownstreamEvent.ChatThreadCreated,
    (event) => {
      const payload = event.payload as unknown as ChatThreadCreatedPayload
      context.dispatch(addNotification({
        id: `thread-${payload.threadId}`,
        type: NotificationDownstreamEvent.ChatThreadCreated,
        title: `New thread from ${payload.actorName}`,
        body: 'Someone started a thread in your conversation',
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { threadId: payload.threadId, conversationId: payload.conversationId },
      }))
    },
  )
}
