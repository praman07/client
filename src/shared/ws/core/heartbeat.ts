/**
 * HEARTBEAT: WebSocket keep-alive mechanism
 *
 * Responsibility:
 * - Send periodic ping messages to keep connection alive
 * - Prevent idle timeout disconnections
 * - Detect broken connections
 *
 * Interval: 30 seconds
 */

const HEARTBEAT_INTERVAL_MS = 30000

let pingInterval: ReturnType<typeof setInterval> | null = null

/**
 * Starts sending periodic ping messages.
 * Only one heartbeat can be active at a time (idempotent).
 */
export function startHeartbeat(sendPing: () => void): void {
  // Clear any existing interval
  if (pingInterval) {
    clearInterval(pingInterval)
  }

  pingInterval = setInterval(() => {
    sendPing()
  }, HEARTBEAT_INTERVAL_MS)
}

/**
 * Stops the heartbeat interval.
 */
export function stopHeartbeat(): void {
  if (pingInterval) {
    clearInterval(pingInterval)
    pingInterval = null
  }
}

/**
 * Returns whether heartbeat is currently active.
 */
export function isActive(): boolean {
  return pingInterval !== null
}
