/**
 * RECONNECTION STRATEGY: Exponential backoff for WebSocket reconnection
 *
 * Responsibility:
 * - Calculate reconnection delay with exponential backoff
 * - Cap maximum reconnection attempts
 * - Provide retry scheduling
 *
 * Base interval: 2 seconds
 * Max attempts: 5
 * Backoff multiplier: 1.5x per attempt
 */

import { createLogger } from '@/shared/lib/logger'

const RECONNECT_INTERVAL_MS = 2000
const MAX_RECONNECT_ATTEMPTS = 5

const log = createLogger('ws:reconnect')

type ReconnectState = {
  attempts: number
  timeout: ReturnType<typeof setTimeout> | null
}

const state: ReconnectState = {
  attempts: 0,
  timeout: null,
}

/**
 * Calculates reconnection delay using exponential backoff.
 * Formula: baseDelay * (1.5 ^ attempts)
 */
export function calculateDelay(attempts: number): number {
  return RECONNECT_INTERVAL_MS * Math.pow(1.5, attempts)
}

/**
 * Schedules a reconnection attempt if under max attempts.
 *
 * @returns true if scheduled, false if max attempts reached
 */
export function scheduleReconnect(reconnectFn: () => void): boolean {
  if (state.attempts >= MAX_RECONNECT_ATTEMPTS) {
    log.error('Max reconnect attempts reached')
    return false
  }

  const delay = calculateDelay(state.attempts)
  log.info(
    `Scheduling reconnect in ${delay}ms (attempt ${state.attempts + 1}/${MAX_RECONNECT_ATTEMPTS})`,
  )

  state.timeout = setTimeout(() => {
    state.attempts++
    reconnectFn()
  }, delay)

  return true
}

/**
 * Resets reconnection state (called on successful connection).
 */
export function resetAttempts(): void {
  state.attempts = 0
  if (state.timeout) {
    clearTimeout(state.timeout)
    state.timeout = null
  }
}

/**
 * Cancels any pending reconnection attempt.
 */
export function cancelScheduled(): void {
  if (state.timeout) {
    clearTimeout(state.timeout)
    state.timeout = null
  }
}

/**
 * Returns current attempt count.
 */
export function getAttempts(): number {
  return state.attempts
}

/**
 * Returns maximum allowed attempts.
 */
export function getMaxAttempts(): number {
  return MAX_RECONNECT_ATTEMPTS
}
