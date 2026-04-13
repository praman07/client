/**
 * Handler: project.member.added
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ProjectMemberAddedContract, ProjectMemberAddedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerProjectMemberAddedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ProjectMemberAddedContract>(
    NotificationDownstreamEvent.ProjectMemberAdded,
    (event) => {
      const payload = event.payload as unknown as ProjectMemberAddedPayload
      context.dispatch(addNotification({
        id: `project-member-add-${payload.projectId}-${payload.addedUserId}`,
        type: NotificationDownstreamEvent.ProjectMemberAdded,
        title: `${payload.addedUserName} added to "${payload.projectName}"`,
        body: `As ${payload.roleName} by ${payload.actorName}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { projectId: payload.projectId, workspaceId: payload.workspaceId },
      }))
    },
  )
}
