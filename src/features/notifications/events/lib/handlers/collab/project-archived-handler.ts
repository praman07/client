/**
 * Handler: project.archived
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ProjectArchivedContract, ProjectArchivedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerProjectArchivedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ProjectArchivedContract>(
    NotificationDownstreamEvent.ProjectArchived,
    (event) => {
      const payload = event.payload as unknown as ProjectArchivedPayload
      context.dispatch(addNotification({
        id: `project-archived-${payload.projectId}`,
        type: NotificationDownstreamEvent.ProjectArchived,
        title: `Project "${payload.projectName}" archived`,
        body: `Archived by ${payload.actorName}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { projectId: payload.projectId, workspaceId: payload.workspaceId },
      }))
    },
  )
}
