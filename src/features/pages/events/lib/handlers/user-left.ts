/**
 * Handler: page:user-left
 * Removes a collaborator from presence state.
 *
 * @layer Features
 */

import type { UserLeftPayload } from '@/shared/contracts/pages'
import type { PageEventHandlerContext } from '../../model'
import { removePageCollaborator } from '@/entities/page-presence'
import { registerHandler } from '@/shared/ws/event-bus'
import { PageDownstreamEvent } from '@/shared/contracts/pages'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:user-left')

export function handleUserLeft(
  payload: UserLeftPayload,
  context: PageEventHandlerContext,
): void {
  const { userId } = payload
  const { dispatch } = context

  log.debug('User left page', { userId })

  dispatch(removePageCollaborator({ userId }))
}

/** Registration wrapper — called by registerPageHandlers. */
export function registerPageUserLeftHandler(context: PageEventHandlerContext) {
  return registerHandler(PageDownstreamEvent.UserLeft, (event) => {
    handleUserLeft(event.payload as UserLeftPayload, context)
  })
}
