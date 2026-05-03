/**
 * Handler: workspace.invite.resent
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WorkspaceInviteResentContract, WorkspaceInviteResentPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWorkspaceInviteResentHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WorkspaceInviteResentContract>(
    NotificationDownstreamEvent.WorkspaceInviteResent,
    (event) => {
      const payload = event.payload as unknown as WorkspaceInviteResentPayload
      context.dispatch(addNotification({
        id: `invite-resent-${payload.inviteId}`,
        type: NotificationDownstreamEvent.WorkspaceInviteResent,
        title: `Invite resent to ${payload.inviteeEmail}`,
        body: `${payload.actorName} resent the invite for ${payload.workspaceName}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { workspaceId: payload.workspaceId, inviteId: payload.inviteId },
      }))
    },
  )
}
