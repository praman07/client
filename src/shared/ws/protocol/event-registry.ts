/**
 * EVENT REGISTRY: Runtime validation for WebSocket events
 *
 * Responsibility:
 * - Register valid event types at runtime (replaces hardcoded enums)
 * - Validate event types dynamically
 * - Support multiple domains registering their events
 *
 * Architecture:
 * - Each domain registers its events on startup
 * - Centralized validation for all domains
 */

type EventDirection = 'upstream' | 'downstream'

interface EventMetadata {
  type: string
  direction: EventDirection
  domain: string
}

const registry = new Map<string, EventMetadata>()

/**
 * Registers an event type with the system.
 *
 * @param type - Full event type (e.g., "chat:send-message")
 * @param direction - 'upstream' (client→server) or 'downstream' (server→client)
 * @param domain - Domain name (e.g., "chat", "pages")
 */
export function registerEventType(
  type: string,
  direction: EventDirection,
  domain: string,
): void {
  if (registry.has(type)) {
    console.warn(`[EventRegistry] Event type already registered: ${type}`)
    return
  }

  registry.set(type, { type, direction, domain })
}

/**
 * Unregisters an event type (for cleanup).
 */
export function unregisterEventType(type: string): void {
  registry.delete(type)
}

/**
 * Checks if an event type is registered.
 */
export function isValidEvent(type: string): boolean {
  return registry.has(type)
}

/**
 * Gets event direction (upstream/downstream).
 */
export function getDirection(type: string): EventDirection | null {
  return registry.get(type)?.direction ?? null
}

/**
 * Gets event domain.
 */
export function getDomain(type: string): string | null {
  return registry.get(type)?.domain ?? null
}

/**
 * Gets all registered events for a domain.
 */
export function getEventsForDomain(domain: string): Array<EventMetadata> {
  return Array.from(registry.values()).filter((e) => e.domain === domain)
}

/**
 * Gets all upstream events.
 */
export function getUpstreamEvents(): Array<EventMetadata> {
  return Array.from(registry.values()).filter((e) => e.direction === 'upstream')
}

/**
 * Gets all downstream events.
 */
export function getDownstreamEvents(): Array<EventMetadata> {
  return Array.from(registry.values()).filter(
    (e) => e.direction === 'downstream',
  )
}

/**
 * Clears all registered events (for testing).
 */
export function clearRegistry(): void {
  registry.clear()
}
