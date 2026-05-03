/**
 * Handler: user.welcome
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { UserWelcomeContract, UserWelcomePayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerUserWelcomeHandler(context: NotificationEventHandlerContext) {
  return registerHandler<UserWelcomeContract>(
    NotificationDownstreamEvent.UserWelcome,
    (event) => {
      const payload = event.payload as unknown as UserWelcomePayload
      context.dispatch(addNotification({
        id: `welcome-${payload.userId}`,
        type: NotificationDownstreamEvent.UserWelcome,
        title: `Welcome to Collabifyy, ${payload.userName}!`,
        body: `You've joined ${payload.workspaceName}`,
        read: false,
        createdAt: new Date().toISOString(),
        metadata: { workspaceId: payload.workspaceId },
      }))
    },
  )
}
