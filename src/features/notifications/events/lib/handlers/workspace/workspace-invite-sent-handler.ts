/**
 * Handler: workspace.invite.sent
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WorkspaceInviteSentContract, WorkspaceInviteSentPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWorkspaceInviteSentHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WorkspaceInviteSentContract>(
    NotificationDownstreamEvent.WorkspaceInviteSent,
    (event) => {
      const payload = event.payload as unknown as WorkspaceInviteSentPayload
      context.dispatch(addNotification({
        id: `workspace-invite-sent-${payload.inviteId}`,
        type: NotificationDownstreamEvent.WorkspaceInviteSent,
        title: `Invite sent to ${payload.inviteeEmail}`,
        body: `${payload.actorName} invited you to ${payload.workspaceName} as ${payload.roleName}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { workspaceId: payload.workspaceId, inviteeEmail: payload.inviteeEmail },
      }))
    },
  )
}
