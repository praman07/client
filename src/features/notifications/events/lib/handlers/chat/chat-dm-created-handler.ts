/**
 * Handler: chat.dm.created
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatDmCreatedContract, ChatDmCreatedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerChatDmCreatedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatDmCreatedContract>(
    NotificationDownstreamEvent.ChatDmCreated,
    (event) => {
      const payload = event.payload as unknown as ChatDmCreatedPayload
      context.dispatch(addNotification({
        id: `dm-${payload.conversationId}`,
        type: NotificationDownstreamEvent.ChatDmCreated,
        title: `New DM from ${payload.actorName}`,
        body: 'You have been added to a new direct message',
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { conversationId: payload.conversationId },
      }))
    },
  )
}
