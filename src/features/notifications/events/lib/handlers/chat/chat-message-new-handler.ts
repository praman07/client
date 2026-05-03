/**
 * Handler: chat.message.new
 * 
 * Uses the config-driven toast system for scalability.
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatMessageNewContract, ChatMessageNewPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'
import { showToastFromEvent } from '@/shared/ui/toast'

export function registerChatMessageNewHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatMessageNewContract>(
    NotificationDownstreamEvent.ChatMessageNew,
    (event) => {
      const payload = event.payload as unknown as ChatMessageNewPayload
      const preview = payload.preview ?? ''
      
      // Show rich toast using config registry
      showToastFromEvent(NotificationDownstreamEvent.ChatMessageNew, payload)
      
      // Also update Redux notification state
      context.dispatch(addNotification({
        id: `msg-new-${payload.messageId}`,
        type: NotificationDownstreamEvent.ChatMessageNew,
        title: 'New message',
        body: preview.slice(0, 100),
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: undefined,
        metadata: { conversationId: payload.conversationId, messageId: payload.messageId },
      }))
    },
  )
}
