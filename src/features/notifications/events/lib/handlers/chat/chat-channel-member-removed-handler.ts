/**
 * Handler: chat.channel.member.removed
 *
 * Handles channel member removal events with two behaviors:
 * 1. If current user is removed: invalidate queries + show error toast + close chat window
 * 2. If another user is removed: just add notification (existing behavior)
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ChatChannelMemberRemovedContract, ChatChannelMemberRemovedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'
import { showToast } from '@/shared/ui/toast'
import { invalidateOnChannelRemoval, isCurrentUserRemoved } from '@/features/access-revoked/lib/invalidate-queries'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:channel-member-removed-handler')

export function registerChatChannelMemberRemovedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ChatChannelMemberRemovedContract>(
    NotificationDownstreamEvent.ChatChannelMemberRemoved,
    (event) => {
      const payload = event.payload as unknown as ChatChannelMemberRemovedPayload
      const currentUserId = context.getCurrentUserId()

      log.info('Received channel member removed event', {
        conversationId: payload.conversationId,
        conversationName: payload.conversationName,
        removedUserId: payload.removedUserId,
        isCurrentUser: isCurrentUserRemoved(currentUserId, payload.removedUserId),
      })

      // ── Check if current user is the one being removed ──
      if (isCurrentUserRemoved(currentUserId, payload.removedUserId)) {
        handleCurrentUserRemoved(context, payload)
      }

      // ── Always add notification for all users ──
      context.dispatch(addNotification({
        id: `channel-member-removed-${payload.conversationId}-${payload.removedUserId}`,
        type: NotificationDownstreamEvent.ChatChannelMemberRemoved,
        title: `Removed from #${payload.conversationName}`,
        body: `${payload.actorName} removed you from this channel`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: {
          conversationId: payload.conversationId,
          conversationName: payload.conversationName,
        },
      }))
    },
  )
}

/**
 * Handle the case when the current user is removed from a channel.
 * - Invalidate related queries
 * - Show error toast
 * - Remove from local cache
 */
function handleCurrentUserRemoved(
  _context: NotificationEventHandlerContext,
  payload: ChatChannelMemberRemovedPayload
) {
  log.warn('Current user was removed from channel', {
    conversationId: payload.conversationId,
    conversationName: payload.conversationName,
  })

  // 1. Invalidate queries
  invalidateOnChannelRemoval(
    payload.conversationId,
    payload.workspaceId
  )

  // 2. Show error toast
  showToast({
    id: `channel-removed-${payload.conversationId}`,
    variant: 'error',
    title: 'Access Revoked',
    subtitle: `You were removed from #${payload.conversationName}`,
    action: {
      label: 'Dismiss',
      onClick: () => {
        log.debug('User dismissed channel removal toast')
      },
    },
  })

  // 3. TODO: Emit event to close ChatWindow component
  // This would be handled by a store/event that ChatWindow subscribes to
  // For now, we rely on query invalidation + navigation away from the channel

  // 4. TODO: Navigate away from the channel if user is currently viewing it
  // This can be implemented via a centralized navigation service or route guard
}