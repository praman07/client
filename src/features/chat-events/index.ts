import { registerNewMessageHandler } from './new-message'
import { registerAckMessageHandler } from './ack-message'
import type { ChatEventHandlerContext } from './new-message'

import { startOutboxRetryWorker } from './outbox-worker'

export function registerChatHandlers(context: ChatEventHandlerContext) {
  // Start the background worker
  const stopWorker = startOutboxRetryWorker()

  const unsubs = [
    registerNewMessageHandler(context),
    registerAckMessageHandler(context),
  ]

  return () => {
    stopWorker() // Stop the interval
    unsubs.forEach((u) => u()) // Unsubscribe listeners
  }
}
export { sendMessage } from './send-message'
