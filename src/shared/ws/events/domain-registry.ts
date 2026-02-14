/**
 * DOMAIN REGISTRY: Central registration for multi-domain WebSocket architecture
 *
 * Responsibility:
 * - Register domain event types and metadata
 * - Validate events belong to registered domains
 * - Provide domain discovery/introspection
 *
 * Architecture:
 * - Each domain (Chat, Pages, Whiteboard) registers on startup
 * - Event types validated against registered domains
 * - Supports N domains dynamically
 */

import * as eventRegistry from '../protocol/event-registry'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('ws:registry')

export interface DomainEventConfig {
  domain: string
  upstreamEvents: Array<string> // Client → Server
  downstreamEvents: Array<string> // Server → Client
}

const domains = new Map<string, DomainEventConfig>()

/**
 * Registers a domain with its event types.
 * Automatically registers events with event-registry.
 *
 * @param config - Domain configuration
 */
export function registerDomain(config: DomainEventConfig): void {
  const { domain, upstreamEvents, downstreamEvents } = config

  if (domains.has(domain)) {
    log.warn(`Domain already registered: ${domain}`)
    return
  }

  // Register domain
  domains.set(domain, config)

  // Register all upstream events
  upstreamEvents.forEach((type) => {
    eventRegistry.registerEventType(type, 'upstream', domain)
  })

  // Register all downstream events
  downstreamEvents.forEach((type) => {
    eventRegistry.registerEventType(type, 'downstream', domain)
  })

  log.debug(
    `Registered domain: ${domain} (${upstreamEvents.length} upstream, ${downstreamEvents.length} downstream)`,
  )
}

/**
 * Checks if a domain is registered.
 */
export function hasDomain(domain: string): boolean {
  return domains.has(domain)
}

/**
 * Gets configuration for a specific domain.
 */
export function getDomainConfig(domain: string): DomainEventConfig | undefined {
  return domains.get(domain)
}

/**
 * Gets all registered domains.
 */
export function getAllDomains(): Array<string> {
  return Array.from(domains.keys())
}

/**
 * Validates if an event type belongs to any registered domain.
 */
export function isValidUpstream(type: string): boolean {
  return eventRegistry.getDirection(type) === 'upstream'
}

/**
 * Validates if an event type is a downstream event.
 */
export function isValidDownstream(type: string): boolean {
  return eventRegistry.getDirection(type) === 'downstream'
}

/**
 * Gets domain name from event type.
 * Convention: events are formatted as "{domain}:{event}"
 */
export function extractDomain(eventType: string): string | null {
  const parts = eventType.split(':')
  return parts.length >= 2 ? parts[0] : null
}

/**
 * Unregisters a domain (for testing/cleanup).
 */
export function unregisterDomain(domain: string): void {
  const config = domains.get(domain)
  if (!config) return

  // Unregister all upstream events
  config.upstreamEvents.forEach((type) => {
    eventRegistry.unregisterEventType(type)
  })

  // Unregister all downstream events
  config.downstreamEvents.forEach((type) => {
    eventRegistry.unregisterEventType(type)
  })

  domains.delete(domain)
  log.debug(`Unregistered domain: ${domain}`)
}

/**
 * Clears all registered domains (for testing).
 */
export function clearAll(): void {
  domains.clear()
  eventRegistry.clearRegistry()
}
