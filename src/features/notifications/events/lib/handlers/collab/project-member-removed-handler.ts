/**
 * Handler: project.member.removed
 *
 * Handles project member removal events with two behaviors:
 * 1. If current user is removed: invalidate queries + show error toast
 * 2. If another user is removed: just add notification (existing behavior)
 */

import type { NotificationEventHandlerContext } from '../../../model/types'
import type { ProjectMemberRemovedContract, ProjectMemberRemovedPayload } from '@/shared/contracts/notification/downstream'
import { registerHandler } from '@/shared/ws/event-bus'
import { addNotification } from '@/entities/notification'
import { NotificationDownstreamEvent } from '@/shared/contracts/notification/events'
import { showToast } from '@/shared/ui/toast'
import { invalidateOnProjectRemoval, isCurrentUserRemoved } from '@/features/access-revoked/lib/invalidate-queries'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('project:member-removed-handler')

export function registerProjectMemberRemovedHandler(context: NotificationEventHandlerContext) {
  return registerHandler<ProjectMemberRemovedContract>(
    NotificationDownstreamEvent.ProjectMemberRemoved,
    (event) => {
      const payload = event.payload as unknown as ProjectMemberRemovedPayload
      const currentUserId = context.getCurrentUserId()

      log.info('Received project member removed event', {
        projectId: payload.projectId,
        projectName: payload.projectName,
        removedUserId: payload.removedUserId,
        isCurrentUser: isCurrentUserRemoved(currentUserId, payload.removedUserId),
      })

      // ── Check if current user is the one being removed ──
      if (isCurrentUserRemoved(currentUserId, payload.removedUserId)) {
        handleCurrentUserRemoved(context, payload)
      }

      // ── Always add notification for all users ──
      context.dispatch(addNotification({
        id: `project-member-remove-${payload.projectId}-${payload.removedUserId}`,
        type: NotificationDownstreamEvent.ProjectMemberRemoved,
        title: `Removed from "${payload.projectName}"`,
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

/**
 * Handle the case when the current user is removed from a project.
 * - Invalidate related queries
 * - Show error toast
 * - Navigate away from project
 */
function handleCurrentUserRemoved(
  _context: NotificationEventHandlerContext,
  payload: ProjectMemberRemovedPayload
) {
  log.warn('Current user was removed from project', {
    projectId: payload.projectId,
    projectName: payload.projectName,
  })

  // 1. Invalidate queries
  invalidateOnProjectRemoval(payload.projectId, payload.workspaceId)

  // 2. Show error toast
  showToast({
    id: `project-removed-${payload.projectId}`,
    variant: 'error',
    title: 'Project Access Revoked',
    subtitle: `You were removed from "${payload.projectName}"`,
    action: {
      label: 'Dismiss',
      onClick: () => {
        log.debug('User dismissed project removal toast')
      },
    },
  })

  // 3. TODO: If currently in this project, redirect to workspace overview
  // This can be implemented via route guard or navigation service
  // For now, we rely on query invalidation + user clicking the toast action
}
