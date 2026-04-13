/**
 * Handler: project.member.removed
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ProjectMemberRemovedContract, ProjectMemberRemovedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerProjectMemberRemovedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ProjectMemberRemovedContract>(
    NotificationDownstreamEvent.ProjectMemberRemoved,
    (event) => {
      const payload = event.payload as unknown as ProjectMemberRemovedPayload
      context.dispatch(addNotification({
        id: `project-member-remove-${payload.projectId}-${payload.removedUserId}`,
        type: NotificationDownstreamEvent.ProjectMemberRemoved,
        title: `${payload.removedUserName} removed from "${payload.projectName}"`,
        body: `Removed by ${payload.actorName}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { projectId: payload.projectId, workspaceId: payload.workspaceId },
      }))
    },
  )
}
