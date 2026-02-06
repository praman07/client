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

import { createLogger } from '@/shared/lib/logger'

const MAX_QUEUE_SIZE = 50

const log = createLogger('ws:queue')

type QueuedMessage = {
  msg: string
  type: string
}

type MessagePriority = 'HIGH' | 'LOW'

/**
 * Priority Rule: Function that determines if an event type is high priority.
 * Domains register their own priority rules via registerPriorityRule().
 *
 * @param eventType - Event type string (e.g., 'chat:send-message')
 * @returns true if the event should be treated as high priority
 */
export type PriorityRule = (eventType: string) => boolean

// Registered priority rules from domains
const priorityRules: Array<PriorityRule> = []

/**
 * Registers a priority rule for determining message queue priority.
 * Domains should call this during plugin initialization.
 *
 * @param rule - Function that returns true for high-priority event types
 *
 * @example
 * // In chat plugin:
 * registerPriorityRule(type =>
 *   type === 'chat:send-message' ||
 *   type === 'chat:send-thread-message'
 * )
 */
export function registerPriorityRule(rule: PriorityRule): void {
  priorityRules.push(rule)
}

/**
 * Clears all registered priority rules.
 * Used for testing and plugin cleanup.
 */
export function clearPriorityRules(): void {
  priorityRules.length = 0
}

const messageQueue: Array<QueuedMessage> = []

/**
 * Determines message priority based on registered priority rules.
 * HIGH: Any rule returns true
 * LOW: No rules match
 *
 * Note: If no rules are registered, all messages are LOW priority.
 */
export function getMessagePriority(type: string): MessagePriority {
  // Check if any registered rule marks this as high priority
  const isHighPriority = priorityRules.some((rule) => rule(type))
  return isHighPriority ? 'HIGH' : 'LOW'
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
      log.warn('Queue full, dropping low-priority message:', type)
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
