/**
 * Handler: chat.message.mention
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatMessageMentionContract, ChatMessageMentionPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerChatMessageMentionHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatMessageMentionContract>(
    NotificationDownstreamEvent.ChatMessageMention,
    (event) => {
      const payload = event.payload as unknown as ChatMessageMentionPayload
      context.dispatch(addNotification({
        id: `mention-${payload.messageId}-${payload.mentionedUserId}`,
        type: NotificationDownstreamEvent.ChatMessageMention,
        title: `${payload.actorName} mentioned you`,
        body: payload.contentPreview.slice(0, 100),
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { conversationId: payload.conversationId, messageId: payload.messageId },
      }))
    },
  )
}
