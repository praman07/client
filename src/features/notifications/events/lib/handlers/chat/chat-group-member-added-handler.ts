/**
 * Handler: chat.group.member.added
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatGroupMemberAddedContract, ChatGroupMemberAddedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerChatGroupMemberAddedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatGroupMemberAddedContract>(
    NotificationDownstreamEvent.ChatGroupMemberAdded,
    (event) => {
      const payload = event.payload as unknown as ChatGroupMemberAddedPayload
      context.dispatch(addNotification({
        id: `group-add-${payload.conversationId}-${payload.addedUserId}`,
        type: NotificationDownstreamEvent.ChatGroupMemberAdded,
        title: `${payload.actorName} added ${payload.addedUserName}`,
        body: 'You were added to a group conversation',
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { conversationId: payload.conversationId },
      }))
    },
  )
}
