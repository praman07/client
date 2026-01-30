/**
 * WS MANAGER: Unified facade for WebSocket transport layer
 *
 * Responsibility:
 * - Provide clean public API for WebSocket operations
 * - Coordinate between connection, subscriptions, and events
 * - Abstract complexity from application layer
 *
 * Architecture:
 * - Factory function (not singleton) for testability
 * - Delegates to specialized modules (connection, subscriptions, etc.)
 * - Domain-agnostic design
 */

import * as connectionManager from './core/connection-manager'
import * as heartbeat from './core/heartbeat'
import * as messageQueue from './core/message-queue'
import * as reconnectionStrategy from './core/reconnection-strategy'
import * as leaderIntegration from './core/leader-integration'
import * as subscriptionManager from './subscriptions/subscription-manager'
import * as subscriptionRecovery from './subscriptions/subscription-recovery'
import type { ClientMessage } from './protocol/core-protocol'
import type { ConnectionStatus } from './core/connection-manager'

export interface WSManager {
  // Connection control
  connect: (token: string, workspaceId: string) => void
  disconnect: () => void

  // Message emission
  emit: <T>(type: string, payload: T) => void

  // Subscriptions
  subscribe: <T>(factory: subscriptionManager.SubscriptionFactory<T>) => void
  unsubscribe: (domain: string, id: string) => void

  // Status
  onStatusChange: (callback: (status: ConnectionStatus) => void) => () => void
  onAuthError: (callback: () => void) => () => void
  getStatus: () => ConnectionStatus
}

type StatusCallback = (status: ConnectionStatus) => void
type AuthErrorCallback = () => void

const statusListeners = new Set<StatusCallback>()
const authErrorListeners = new Set<AuthErrorCallback>()

/**
 * Creates a WebSocket manager instance.
 * Factory pattern for testability (no singleton).
 */
export function createWSManager(): WSManager {
  let currentStatus: ConnectionStatus = 'DISCONNECTED'

  // Setup connection manager callbacks
  connectionManager.setupCallbacks({
    onStateChange: (state) => {
      const newStatus = connectionManager.getPublicStatus(state)
      currentStatus = newStatus
      statusListeners.forEach((cb) => cb(newStatus))
    },
    onAuthError: () => {
      authErrorListeners.forEach((cb) => cb())
    },
  })

  // Setup leader integration
  leaderIntegration.setupLeaderIntegration({
    onPromoted: () => {
      console.log('[WSManager] Promoted to leader, connecting...')
      reconnectionStrategy.resetAttempts()
      attemptConnection()
    },
    onDemoted: () => {
      console.log('[WSManager] Demoted from leader, disconnecting...')
      connectionManager.closeConnection()
      heartbeat.stopHeartbeat()
    },
  })

  function sendPing(): void {
    const sent = connectionManager.sendEnvelope({
      type: 'ping',
      payload: {},
    })
    if (!sent) {
      console.warn('[WSManager] Failed to send ping (socket not ready)')
    }
  }

  function attemptConnection(): void {
    const success = connectionManager.establishConnection(
      leaderIntegration.getIsLeader(),
      handleConnected,
      handleDisconnected,
    )

    if (!success) {
      console.log('[WSManager] Connection skipped (waiting for auth/workspace)')
    }
  }

  function handleConnected(): void {
    // Flush queued messages
    messageQueue.flush((msg) => {
      if (connectionManager.isOpen()) {
        connectionManager.sendEnvelope(JSON.parse(msg))
      }
    })

    // Start heartbeat
    heartbeat.startHeartbeat(sendPing)

    // Re-subscribe to active subscriptions
    subscriptionRecovery.resubscribeAll((type, payload) => {
      manager.emit(type, payload)
    })
  }

  function handleDisconnected(): void {
    heartbeat.stopHeartbeat()

    const scheduled = reconnectionStrategy.scheduleReconnect(() => {
      attemptConnection()
    })

    if (!scheduled) {
      console.error('[WSManager] Max reconnect attempts reached')
      currentStatus = 'OFFLINE'
      statusListeners.forEach((cb) => cb('OFFLINE'))
    }
  }

  const manager: WSManager = {
    connect(token: string, workspaceId: string) {
      connectionManager.updateCredentials(token, workspaceId)

      // Reset reconnection state if coming from offline
      if (currentStatus === 'OFFLINE') {
        reconnectionStrategy.resetAttempts()
      }

      attemptConnection()
    },

    disconnect() {
      heartbeat.stopHeartbeat()
      reconnectionStrategy.cancelScheduled()
      messageQueue.clear()
      subscriptionManager.clear()
      connectionManager.closeConnection()
    },

    emit<T>(type: string, payload: T) {
      const envelope: Omit<ClientMessage<T>, 'id'> = {
        type,
        payload,
      }

      const sent = connectionManager.sendEnvelope(envelope as any)

      // Queue if not sent
      if (!sent) {
        messageQueue.enqueue(
          JSON.stringify({ ...envelope, id: crypto.randomUUID() }),
          type,
        )
      }
    },

    subscribe<T>(factory: subscriptionManager.SubscriptionFactory<T>) {
      subscriptionManager.subscribe(factory)

      // Immediately send subscription if connected
      if (connectionManager.isOpen()) {
        factory
          .createPayload()
          .then((payload) => {
            const eventType = `${factory.domain}:subscribe-channel`
            manager.emit(eventType, payload)
          })
          .catch((err) => {
            console.error(
              '[WSManager] Failed to create subscription payload:',
              err,
            )
          })
      }
    },

    unsubscribe(domain: string, id: string) {
      const existed = subscriptionManager.unsubscribe(domain, id)

      if (existed && connectionManager.isOpen()) {
        const eventType = `${domain}:unsubscribe-channel`
        manager.emit(eventType, { conversationId: id })
      }
    },

    onStatusChange(callback: StatusCallback) {
      statusListeners.add(callback)
      return () => {
        statusListeners.delete(callback)
      }
    },

    onAuthError(callback: AuthErrorCallback) {
      authErrorListeners.add(callback)
      return () => {
        authErrorListeners.delete(callback)
      }
    },

    getStatus() {
      return currentStatus
    },
  }

  return manager
}

// Export singleton instance for backwards compatibility
export const wsManager = createWSManager()
