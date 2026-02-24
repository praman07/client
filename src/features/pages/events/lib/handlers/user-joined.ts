/**
 * Handler: page:user-joined
 * Adds a newly joined collaborator to presence state.
 *
 * @layer Features
 */

import type { UserJoinedPayload } from '@/shared/contracts/pages'
import type { PageEventHandlerContext } from '../../model'
import { addPageCollaborator } from '@/entities/page-presence'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:user-joined')

export function handleUserJoined(
  payload: UserJoinedPayload,
  context: PageEventHandlerContext,
): void {
  const { userId, fullName, avatarUrl, timestamp } = payload
  const { dispatch } = context

  if (!userId) {
    log.warn('user-joined missing userId — ignored', { payload })
    return
  }

  log.debug('User joined page', { userId, fullName })

  dispatch(
    addPageCollaborator({
      userId,
      fullName,
      avatarUrl,
      isIdle: false,
      joinedAt: timestamp,
    }),
  )
}
