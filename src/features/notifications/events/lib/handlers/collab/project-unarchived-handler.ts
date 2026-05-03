/**
 * Handler: project.unarchived
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ProjectUnarchivedContract, ProjectUnarchivedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerProjectUnarchivedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ProjectUnarchivedContract>(
    NotificationDownstreamEvent.ProjectUnarchived,
    (event) => {
      const payload = event.payload as unknown as ProjectUnarchivedPayload
      context.dispatch(addNotification({
        id: `project-unarchived-${payload.projectId}`,
        type: NotificationDownstreamEvent.ProjectUnarchived,
        title: `Project "${payload.projectName}" restored`,
        body: `Restored by ${payload.actorName}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { projectId: payload.projectId, workspaceId: payload.workspaceId },
      }))
    },
  )
}
