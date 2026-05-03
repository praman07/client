/**
 * Handler: chat.reaction.added
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatReactionAddedContract, ChatReactionAddedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerChatReactionAddedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatReactionAddedContract>(
    NotificationDownstreamEvent.ChatReactionAdded,
    (event) => {
      const payload = event.payload as unknown as ChatReactionAddedPayload
      context.dispatch(addNotification({
        id: `reaction-${payload.messageId}-${payload.actorId}`,
        type: NotificationDownstreamEvent.ChatReactionAdded,
        title: `${payload.actorName} reacted to your message`,
        body: `Reacted with ${payload.emoji}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { messageId: payload.messageId, conversationId: payload.conversationId },
      }))
    },
  )
}
