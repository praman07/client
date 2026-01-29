/**
 * MESSAGE QUEUE: Priority-based buffering for WebSocket messages
 *
 * Responsibility:
 * - Queue messages when socket is not ready
 * - Prioritize user actions (send-message) over system actions (typing)
 * - Drop low-priority messages when queue is full
 * - Flush queue when connection restored
 *
 * Max queue size: 50 messages
 */

const MAX_QUEUE_SIZE = 50

type QueuedMessage = {
  msg: string
  type: string
}

type MessagePriority = 'HIGH' | 'LOW'

const messageQueue: Array<QueuedMessage> = []

/**
 * Determines message priority based on event type.
 * HIGH: User-initiated actions (send, edit, delete)
 * LOW: System/auxiliary actions (typing, presence)
 */
export function getMessagePriority(type: string): MessagePriority {
  // High priority: User content creation/modification
  if (
    type === 'chat:send-message' ||
    type === 'chat:send-thread-message' ||
    type === 'chat:edit-message' ||
    type === 'chat:delete-message'
  ) {
    return 'HIGH'
  }
  // Low priority: Everything else
  return 'LOW'
}

/**
 * Adds a message to the queue with priority-based eviction.
 *
 * Strategy:
 * - If queue not full: append
 * - If full + incoming HIGH: evict first LOW, or FIFO if none
 * - If full + incoming LOW: drop it
 */
export function enqueue(msg: string, type: string): void {
  if (messageQueue.length >= MAX_QUEUE_SIZE) {
    const incomingPriority = getMessagePriority(type)

    if (incomingPriority === 'HIGH') {
      // Find and evict first low-priority message
      const lowPriIndex = messageQueue.findIndex(
        (item) => getMessagePriority(item.type) === 'LOW',
      )

      if (lowPriIndex !== -1) {
        messageQueue.splice(lowPriIndex, 1)
        messageQueue.push({ msg, type })
      } else {
        // All messages are HIGH priority, use FIFO
        messageQueue.shift()
        messageQueue.push({ msg, type })
      }
    } else {
      // Incoming is LOW priority, drop it
      console.warn(
        '[MessageQueue] Queue full, dropping low-priority message:',
        type,
      )
      return
    }
  } else {
    messageQueue.push({ msg, type })
  }
}

/**
 * Sends all queued messages through the provided send function.
 * Clears queue after flushing.
 */
export function flush(sendFn: (msg: string) => void): void {
  while (messageQueue.length > 0) {
    const item = messageQueue.shift()
    if (item) {
      sendFn(item.msg)
    }
  }
}

/**
 * Returns current queue size (for monitoring/debugging).
 */
export function getQueueSize(): number {
  return messageQueue.length
}

/**
 * Clears all queued messages (used on explicit disconnect).
 */
export function clear(): void {
  messageQueue.length = 0
}
