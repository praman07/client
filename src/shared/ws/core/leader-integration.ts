/**
 * LEADER INTEGRATION: Coupling between WebSocket transport and leader election
 *
 * Responsibility:
 * - Subscribe to leader election state changes
 * - Control connection based on leader status
 * - Ensure only leader tab maintains active WebSocket
 *
 * Architecture:
 * - Leader tab: Connects to WebSocket, processes events
 * - Follower tabs: Relay events via BroadcastChannel, no WebSocket
 */

import { leaderElection } from '@/shared/lib/broadcast/leader-election'

type LeaderCallbacks = {
  onPromoted: () => void
  onDemoted: () => void
}

let isLeader = leaderElection.isLeader()
let unsubscribe: (() => void) | null = null

/**
 * Sets up leader election integration.
 * Calls appropriate callback when leadership status changes.
 */
export function setupLeaderIntegration(callbacks: LeaderCallbacks): void {
  // Clean up any existing subscription
  if (unsubscribe) {
    unsubscribe()
  }

  unsubscribe = leaderElection.subscribe((state) => {
    const wasLeader = isLeader
    isLeader = state === 'LEADER'

    console.log('[LeaderIntegration] Leader state changed:', state)

    if (isLeader && !wasLeader) {
      // Tab promoted to leader
      callbacks.onPromoted()
    } else if (!isLeader && wasLeader) {
      // Tab demoted from leader
      callbacks.onDemoted()
    }
  })
}

/**
 * Returns current leader status.
 */
export function getIsLeader(): boolean {
  return isLeader
}

/**
 * Tears down leader integration (cleanup).
 */
export function teardown(): void {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }
}
