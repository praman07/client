/**
 * PLUGIN REGISTRY: Central registry for domain plugins
 *
 * Responsibility:
 * - Maintain registry of all domain plugins
 * - Orchestrate plugin lifecycle (init, cleanup, connection events)
 * - Provide plugin lookup and introspection
 *
 * Architecture:
 * - Singleton registry pattern
 * - Plugins registered once at app startup
 * - Lifecycle hooks called on WS connection state changes
 */

import { registerDomain } from '../events/domain-registry'
import { registerPriorityRule } from '../core/message-queue'
import type { DomainPlugin } from './domain-plugin'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:plugin-registry')

const plugins = new Map<string, DomainPlugin>()

/**
 * Registers a domain plugin.
 * Automatically registers events, priority rules, and handlers.
 *
 * @param plugin - Domain plugin to register
 */
export function registerPlugin(plugin: DomainPlugin): void {
  const { domain } = plugin

  if (plugins.has(domain)) {
    log.warn(`Plugin already registered: ${domain}`)
    return
  }

  log.debug(`Registering plugin: ${domain}`)

  // 1. Register domain events
  registerDomain({
    domain,
    upstreamEvents: plugin.upstreamEvents,
    downstreamEvents: plugin.downstreamEvents,
  })

  // 2. Register priority rules (if provided)
  if (plugin.priorityRules) {
    plugin.priorityRules.forEach((rule) => {
      registerPriorityRule(rule)
    })
    log.debug(
      `Registered ${plugin.priorityRules.length} priority rules for ${domain}`,
    )
  }

  // 3. Register event handlers
  plugin.registerHandlers()

  // 4. Store plugin in registry
  plugins.set(domain, plugin)

  log.debug(`Plugin registered successfully: ${domain}`)
}

/**
 * Gets a registered plugin by domain name.
 *
 * @param domain - Domain identifier
 * @returns Plugin instance or undefined
 */
export function getPlugin(domain: string): DomainPlugin | undefined {
  return plugins.get(domain)
}

/**
 * Gets all registered plugins.
 *
 * @returns Array of all plugin instances
 */
export function getAllPlugins(): Array<DomainPlugin> {
  return Array.from(plugins.values())
}

/**
 * Unregisters a plugin (primarily for testing).
 *
 * @param domain - Domain identifier
 */
export function unregisterPlugin(domain: string): void {
  const plugin = plugins.get(domain)
  if (!plugin) {
    log.warn(`Plugin not found: ${domain}`)
    return
  }

  log.debug(`Unregistering plugin: ${domain}`)

  // Call cleanup if provided
  if (plugin.cleanup) {
    plugin.cleanup()
  }

  plugins.delete(domain)
}

/**
 * Clears all plugins (primarily for testing).
 */
export function clearPlugins(): void {
  plugins.forEach((plugin) => {
    if (plugin.cleanup) {
      plugin.cleanup()
    }
  })
  plugins.clear()
  log.debug('All plugins cleared')
}

// ═══════════════════════════════════════════════════════════════
// LIFECYCLE ORCHESTRATION
// ═══════════════════════════════════════════════════════════════

/**
 * Notifies all plugins of WebSocket connection.
 * Should be called by connection manager on connect.
 */
export function notifyConnect(): void {
  log.debug('Notifying plugins: onConnect')
  plugins.forEach((plugin) => {
    if (plugin.onConnect) {
      try {
        plugin.onConnect()
      } catch (err) {
        log.error(`Plugin ${plugin.domain} onConnect failed:`, err)
      }
    }
  })
}

/**
 * Notifies all plugins of WebSocket disconnection.
 * Should be called by connection manager on disconnect.
 */
export function notifyDisconnect(): void {
  log.debug('Notifying plugins: onDisconnect')
  plugins.forEach((plugin) => {
    if (plugin.onDisconnect) {
      try {
        plugin.onDisconnect()
      } catch (err) {
        log.error(`Plugin ${plugin.domain} onDisconnect failed:`, err)
      }
    }
  })
}

/**
 * Notifies all plugins of WebSocket reconnection.
 * Should be called by connection manager after successful reconnect.
 */
export function notifyReconnect(): void {
  log.debug('Notifying plugins: onReconnect')
  plugins.forEach((plugin) => {
    if (plugin.onReconnect) {
      try {
        plugin.onReconnect()
      } catch (err) {
        log.error(`Plugin ${plugin.domain} onReconnect failed:`, err)
      }
    }
  })
}
