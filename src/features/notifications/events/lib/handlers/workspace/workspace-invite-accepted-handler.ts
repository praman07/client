/**
 * Handler: workspace.invite.accepted
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WorkspaceInviteAcceptedContract, WorkspaceInviteAcceptedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWorkspaceInviteAcceptedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WorkspaceInviteAcceptedContract>(
    NotificationDownstreamEvent.WorkspaceInviteAccepted,
    (event) => {
      const payload = event.payload as unknown as WorkspaceInviteAcceptedPayload
      context.dispatch(addNotification({
        id: `invite-accepted-${payload.workspaceId}-${payload.newMemberId}`,
        type: NotificationDownstreamEvent.WorkspaceInviteAccepted,
        title: `${payload.newMemberName} joined ${payload.workspaceName}`,
        body: 'accepted your workspace invitation',
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { workspaceId: payload.workspaceId },
      }))
    },
  )
}
