/**
 * Handler: workspace.member.removed
 *
 * Handles workspace member removal events with two behaviors:
 * 1. If current user is removed: invalidate queries + show error toast + redirect to home
 * 2. If another user is removed: just add notification (existing behavior)
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { WorkspaceMemberRemovedContract, WorkspaceMemberRemovedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'
import { showToast } from '@/shared/ui/toast'
import { invalidateOnWorkspaceRemoval, isCurrentUserRemoved } from '@/features/access-revoked/lib/invalidate-queries'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('workspace:member-removed-handler')

export function registerWorkspaceMemberRemovedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<WorkspaceMemberRemovedContract>(
    NotificationDownstreamEvent.WorkspaceMemberRemoved,
    (event) => {
      const payload = event.payload as unknown as WorkspaceMemberRemovedPayload
      const currentUserId = context.getCurrentUserId()

      log.info('Received workspace member removed event', {
        workspaceId: payload.workspaceId,
        workspaceName: payload.workspaceName,
        removedUserId: payload.removedUserId,
        isCurrentUser: isCurrentUserRemoved(currentUserId, payload.removedUserId),
      })

      // ── Check if current user is the one being removed ──
      if (isCurrentUserRemoved(currentUserId, payload.removedUserId)) {
        handleCurrentUserRemoved(context, payload)
      }

      // ── Always add notification for all users ──
      context.dispatch(addNotification({
        id: `member-removed-${payload.workspaceId}-${payload.removedUserId}`,
        type: NotificationDownstreamEvent.WorkspaceMemberRemoved,
        title: `Removed from ${payload.workspaceName}`,
        body: `Removed by ${payload.actorName}`,
        read: false,
        createdAt: new Date().toISOString(),
        actorId: payload.actorId,
        actorName: payload.actorName,
        metadata: { workspaceId: payload.workspaceId },
      }))
    },
  )
}

/**
 * Handle the case when the current user is removed from a workspace.
 * - Invalidate related queries
 * - Show error toast
 * - Navigate away from workspace
 */
function handleCurrentUserRemoved(
  _context: NotificationEventHandlerContext,
  payload: WorkspaceMemberRemovedPayload
) {
  log.warn('Current user was removed from workspace', {
    workspaceId: payload.workspaceId,
    workspaceName: payload.workspaceName,
  })

  // 1. Invalidate queries
  invalidateOnWorkspaceRemoval(payload.workspaceId)

  // 2. Show error toast
  showToast({
    id: `workspace-removed-${payload.workspaceId}`,
    variant: 'error',
    title: 'Workspace Access Revoked',
    subtitle: `You were removed from ${payload.workspaceName}`,
    action: {
      label: 'Go to Home',
      onClick: () => {
        // Navigate to home page - this would be handled by the routing system
        log.debug('User clicked Go to Home from workspace removal toast')
        window.location.href = '/'
      },
    },
  })

  // 3. TODO: If currently in this workspace, redirect to home
  // This can be implemented via route guard or navigation service
  // For now, we rely on query invalidation + user clicking the toast action
}
