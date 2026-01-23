import { chatSessionActions } from './slice'
import type { AppDispatch } from '@/app/store' // Assuming store export
import { eventRouter } from '@/shared/ws/connection-manager/event-router'
import { ServerEventName } from '@/shared/ws/connection-manager/protocol'

/**
 * Initializes the WebSocket event listeners that bridge the Network Layer with Redux.
 * This should be called exactly once when the app/store initializes.
 */
export function startChatSessionListeners(dispatch: AppDispatch) {
  // 1. New Message
  const unsubscribeNewMsg = eventRouter.on(
    ServerEventName.NewMessage,
    (payload) => {
      // Dispatch to Redux (which handles resequencing logic in the reducer/thunk)
      dispatch(chatSessionActions.processIncomingMessage(payload))
    },
  )

  // 2. Message Edited
  const unsubscribeEditMsg = eventRouter.on(
    ServerEventName.MessageEdited,
    (payload) => {
      // TODO: Handle edits
      console.log('[ChatSession] Message Edited:', payload)
    },
  )

  // 3. Sync Required
  const unsubscribeSync = eventRouter.on(
    ServerEventName.SyncRequired,
    (payload) => {
      // Critical: The server is telling us we are broken.
      // dispatch(chatSessionActions.triggerHardReset(payload.reason));
      console.warn('[ChatSession] SYNC REQUIRED:', payload.reason)
    },
  )

  // Return teardown function
  return () => {
    unsubscribeNewMsg()
    unsubscribeEditMsg()
    unsubscribeSync()
  }
}
