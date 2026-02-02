/**
 * SUBSCRIPTION MANAGER: Domain-agnostic subscription tracking
 *
 * Responsibility:
 * - Track active subscription intents across domains
 * - Store subscription payload factories for re-subscription
 * - Namespace subscriptions by domain to prevent collisions
 *
 * Design:
 * - Key format: `{domain}:{id}` (e.g., "chat:channel-123")
 * - Value: Factory function that returns latest payload
 * - Supports multiple domains (Chat, Pages, Whiteboard, etc.)
 */

export interface SubscriptionFactory<T = any> {
  domain: string
  getId: (payload: T) => string
  createPayload: () => Promise<T>
}

const subscriptions = new Map<string, SubscriptionFactory>()

/**
 * Generates subscription key from domain and ID.
 */
function getKey(domain: string, id: string): string {
  return `${domain}:${id}`
}

/**
 * Subscribes to a resource for a given domain.
 * Stores factory for re-subscription on reconnect.
 *
 * @param domain - Domain name (e.g., 'chat', 'pages')
 * @param id - Resource identifier (e.g., channel ID)
 * @param factory - Function to create subscription payload
 */
export function subscribe<T>(factory: SubscriptionFactory<T>): void {
  const { domain, getId, createPayload } = factory

  const key = getKey(domain, getId({} as T)) // Get ID from empty payload for key

  subscriptions.set(key, {
    domain,
    getId,
    createPayload,
  })

  console.log(`[SubscriptionManager] Subscribed: ${key}`)
}

/**
 * Unsubscribes from a resource.
 *
 * @param domain - Domain name
 * @param id - Resource identifier
 * @returns true if unsubscribed, false if not found
 */
export function unsubscribe(domain: string, id: string): boolean {
  const key = getKey(domain, id)
  const existed = subscriptions.has(key)

  if (existed) {
    subscriptions.delete(key)
    console.log(`[SubscriptionManager] Unsubscribed: ${key}`)
  }

  return existed
}

/**
 * Checks if subscribed to a resource.
 */
export function has(domain: string, id: string): boolean {
  return subscriptions.has(getKey(domain, id))
}

/**
 * Gets all subscription factories for a specific domain.
 */
export function getAllForDomain(domain: string): Array<SubscriptionFactory> {
  const results: Array<SubscriptionFactory> = []

  subscriptions.forEach((factory, key) => {
    if (key.startsWith(`${domain}:`)) {
      results.push(factory)
    }
  })

  return results
}

/**
 * Gets all active subscriptions (all domains).
 */
export function getAll(): Array<SubscriptionFactory> {
  return Array.from(subscriptions.values())
}

/**
 * Clears all subscriptions (used on explicit disconnect).
 */
export function clear(): void {
  subscriptions.clear()
  console.log('[SubscriptionManager] Cleared all subscriptions')
}

/**
 * Returns count of active subscriptions.
 */
export function getCount(): number {
  return subscriptions.size
}
