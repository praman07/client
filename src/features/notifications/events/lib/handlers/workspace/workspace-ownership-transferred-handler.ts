/**
 * Handler: workspace.ownership.transferred
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WorkspaceOwnershipTransferredContract, WorkspaceOwnershipTransferredPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWorkspaceOwnershipTransferredHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WorkspaceOwnershipTransferredContract>(
    NotificationDownstreamEvent.WorkspaceOwnershipTransferred,
    (event) => {
      const payload = event.payload as unknown as WorkspaceOwnershipTransferredPayload
      context.dispatch(addNotification({
        id: `ownership-transferred-${payload.workspaceId}`,
        type: NotificationDownstreamEvent.WorkspaceOwnershipTransferred,
        title: `Workspace ownership transferred in ${payload.workspaceName}`,
        body: `${payload.previousOwnerName} → ${payload.newOwnerName}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { workspaceId: payload.workspaceId },
      }))
    },
  )
}
