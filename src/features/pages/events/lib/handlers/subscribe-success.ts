/**
 * Handler: page:subscribe-success
 *
 * Fired after the server validates auth on page:subscribe.
 * Sets connection state, initial lock state, collaborator list,
 * and flushes any queued offline updates.
 *
 * @layer Features
 */

import type { SubscribeSuccessPayload } from '@/shared/contracts/pages'
import type { PageEventHandlerContext } from '../../model'
import {
  pageOfflineQueue,
  setConnectionStatus,
  setPageLocked,
} from '@/entities/page-session'
import { setActivePageCollaborators } from '@/entities/page-presence'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:subscribe-success')

export function handleSubscribeSuccess(
  payload: SubscribeSuccessPayload,
  context: PageEventHandlerContext,
): void {
  const { pageId, isLocked, collaborators } = payload
  const { dispatch } = context

  log.info('Subscribe success', {
    pageId,
    isLocked,
    collaboratorCount: collaborators.length,
  })

  // Mark WS session as connected
  dispatch(setConnectionStatus('connected'))

  // Apply lock state from server — the only source of lock truth
  dispatch(setPageLocked(isLocked))

  // Populate presence (collaborators currently on the page)
  dispatch(
    setActivePageCollaborators(
      collaborators.map((c) => ({
        userId: c.userId,
        fullName: c.fullName,
        avatarUrl: c.avatarUrl,
        isIdle: false,
        joinedAt: Date.now(),
      })),
    ),
  )

  // Flush offline queue — drain any edits made while disconnected
  // Note: flush() returns void and handles errors internally via flushImmediate
  pageOfflineQueue.flush(pageId)
}
