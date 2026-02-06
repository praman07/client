/**
 * DOMAIN PLUGIN: Interface for WebSocket domain plugins
 *
 * Responsibility:
 * - Define contract for domain-specific WebSocket integration
 * - Support runtime registration of domains (Chat, Pages, Whiteboard, etc.)
 * - Enable decoupled domain logic with lifecycle management
 *
 * Architecture:
 * - Each domain implements DomainPlugin interface
 * - Plugins registered at app startup via plugin registry
 * - Event handlers and priority rules attached during initialization
 * - Lifecycle hooks for connection state changes
 */

import type { PriorityRule } from '../core/message-queue'

export interface DomainPlugin {
  /** Domain identifier (e.g., 'chat', 'pages', 'whiteboard') */
  domain: string

  /** Upstream event types (client → server) */
  upstreamEvents: Array<string>

  /** Downstream event types (server → client) */
  downstreamEvents: Array<string>

  /**
   * Optional priority rules for message queue.
   * Domains can define which event types should be high priority.
   */
  priorityRules?: Array<PriorityRule>

  /**
   * Register event handlers for this domain.
   * Called once during app initialization.
   */
  registerHandlers: () => void

  /**
   * Optional cleanup function.
   * Called when plugin is unregistered (testing/hot reload).
   */
  cleanup?: () => void

  /**
   * Optional lifecycle hook: called when WebSocket connects.
   */
  onConnect?: () => void

  /**
   * Optional lifecycle hook: called when WebSocket disconnects.
   */
  onDisconnect?: () => void

  /**
   * Optional lifecycle hook: called when WebSocket reconnects.
   */
  onReconnect?: () => void
}

/**
 * Type-safe helper for defining domain plugins.
 */
export function createDomainPlugin(config: DomainPlugin): DomainPlugin {
  return config
}
