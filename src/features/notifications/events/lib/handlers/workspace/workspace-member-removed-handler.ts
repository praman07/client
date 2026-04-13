/**
 * Handler: workspace.member.removed
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WorkspaceMemberRemovedContract, WorkspaceMemberRemovedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWorkspaceMemberRemovedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WorkspaceMemberRemovedContract>(
    NotificationDownstreamEvent.WorkspaceMemberRemoved,
    (event) => {
      const payload = event.payload as unknown as WorkspaceMemberRemovedPayload
      context.dispatch(addNotification({
        id: `member-removed-${payload.workspaceId}-${payload.removedUserId}`,
        type: NotificationDownstreamEvent.WorkspaceMemberRemoved,
        title: `${payload.removedUserName} removed from ${payload.workspaceName}`,
        body: `Removed by ${payload.actorName}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { workspaceId: payload.workspaceId },
      }))
    },
  )
}
