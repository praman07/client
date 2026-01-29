/**
 * DOMAIN PLUGIN: Interface for WebSocket domain plugins
 *
 * Responsibility:
 * - Define contract for domain-specific WebSocket integration
 * - Support runtime registration of domains (Chat, Pages, Whiteboard, etc.)
 * - Enable decoupled domain logic
 *
 * Architecture:
 * - Each domain implements DomainPlugin interface
 * - Plugins registered at app startup via DomainRegistry component
 * - Event handlers attached during plugin initialization
 */

import type { eventRouter } from '@/shared/ws'

export interface DomainPlugin {
  /** Domain identifier (e.g., 'chat', 'pages', 'whiteboard') */
  domain: string

  /** Upstream event types (client → server) */
  upstreamEvents: string[]

  /** Downstream event types (server → client) */
  downstreamEvents: string[]

  /**
   * Register event handlers for this domain.
   * Called once during app initialization.
   *
   * @param router - Event router for attaching handlers
   */
  registerHandlers: (router: typeof eventRouter) => void

  /**
   * Optional cleanup function.
   * Called when plugin is unregistered (testing/hot reload).
   */
  cleanup?: () => void
}

/**
 * Type-safe helper for defining domain plugins.
 */
export function createDomainPlugin(config: DomainPlugin): DomainPlugin {
  return config
}
