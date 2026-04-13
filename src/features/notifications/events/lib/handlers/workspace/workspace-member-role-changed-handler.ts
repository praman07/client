/**
 * Handler: workspace.member.role_changed
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WorkspaceMemberRoleChangedContract, WorkspaceMemberRoleChangedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWorkspaceMemberRoleChangedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WorkspaceMemberRoleChangedContract>(
    NotificationDownstreamEvent.WorkspaceMemberRoleChanged,
    (event) => {
      const payload = event.payload as unknown as WorkspaceMemberRoleChangedPayload
      context.dispatch(addNotification({
        id: `role-changed-${payload.workspaceId}-${payload.userId}`,
        type: NotificationDownstreamEvent.WorkspaceMemberRoleChanged,
        title: `${payload.userName}'s role changed`,
        body: `${payload.oldRole} → ${payload.newRole} in ${payload.workspaceName}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { workspaceId: payload.workspaceId },
      }))
    },
  )
}
