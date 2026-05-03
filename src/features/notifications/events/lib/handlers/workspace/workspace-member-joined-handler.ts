/**
 * Handler: workspace.member.joined
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WorkspaceMemberJoinedContract, WorkspaceMemberJoinedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'

export function registerWorkspaceMemberJoinedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WorkspaceMemberJoinedContract>(
    NotificationDownstreamEvent.WorkspaceMemberJoined,
    (event) => {
      const payload = event.payload as unknown as WorkspaceMemberJoinedPayload
      context.dispatch(addNotification({
        id: `member-joined-${payload.workspaceId}-${payload.newMemberId}`,
        type: NotificationDownstreamEvent.WorkspaceMemberJoined,
        title: `${payload.newMemberName} joined ${payload.workspaceName}`,
        body: 'New member has joined the workspace',
        read: false,
        createdAt: new Date().toISOString(),
        metadata: { workspaceId: payload.workspaceId },
      }))
    },
  )
}
