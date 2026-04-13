/**
 * Handler: project.member.role_changed
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ProjectMemberRoleChangedContract, ProjectMemberRoleChangedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerProjectMemberRoleChangedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ProjectMemberRoleChangedContract>(
    NotificationDownstreamEvent.ProjectMemberRoleChanged,
    (event) => {
      const payload = event.payload as unknown as ProjectMemberRoleChangedPayload
      context.dispatch(addNotification({
        id: `project-role-${payload.projectId}-${payload.userId}`,
        type: NotificationDownstreamEvent.ProjectMemberRoleChanged,
        title: `${payload.userName}'s role changed in "${payload.projectName}"`,
        body: `${payload.oldRole} → ${payload.newRole}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { projectId: payload.projectId, workspaceId: payload.workspaceId },
      }))
    },
  )
}
