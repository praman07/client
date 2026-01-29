/**
 * SUBSCRIPTION RECOVERY: Re-subscribe logic on reconnection
 *
 * Responsibility:
 * - Replay all active subscriptions when connection restored
 * - Generate fresh payloads (latest cursors/epochs) via factories
 * - Send subscription messages through provided emitter
 *
 * Integration:
 * - Called by connection manager on open event
 * - Uses subscription manager to get active subscriptions
 */

import type { SubscriptionFactory } from './subscription-manager'
import * as subscriptionManager from './subscription-manager'

/**
 * Re-subscribes to all active resources on reconnection.
 *
 * @param emit - Function to emit subscription messages
 */
export async function resubscribeAll(
  emit: <T>(type: string, payload: T) => void,
): Promise<void> {
  const subscriptions = subscriptionManager.getAll()

  if (subscriptions.length === 0) {
    console.log('[SubscriptionRecovery] No active subscriptions to restore')
    return
  }

  console.log(
    `[SubscriptionRecovery] Restoring ${subscriptions.length} subscriptions`,
  )

  const results = await Promise.allSettled(
    subscriptions.map(async (factory: SubscriptionFactory) => {
      try {
        const payload = await factory.createPayload()
        const eventType = `${factory.domain}:subscribe-channel` // Convention

        emit(eventType, payload)

        console.log(`[SubscriptionRecovery] Restored: ${factory.domain}`)
      } catch (err) {
        console.error(
          `[SubscriptionRecovery] Failed to restore ${factory.domain}:`,
          err,
        )
      }
    }),
  )

  const failures = results.filter((r) => r.status === 'rejected')
  if (failures.length > 0) {
    console.warn(
      `[SubscriptionRecovery] ${failures.length}/${subscriptions.length} subscriptions failed`,
    )
  }
}

/**
 * Re-subscribes to resources for a specific domain only.
 */
export async function resubscribeForDomain(
  domain: string,
  emit: <T>(type: string, payload: T) => void,
): Promise<void> {
  const subscriptions = subscriptionManager.getAllForDomain(domain)

  if (subscriptions.length === 0) {
    return
  }

  console.log(
    `[SubscriptionRecovery] Restoring ${subscriptions.length} ${domain} subscriptions`,
  )

  await Promise.allSettled(
    subscriptions.map(async (factory: SubscriptionFactory) => {
      try {
        const payload = await factory.createPayload()
        const eventType = `${domain}:subscribe-channel`

        emit(eventType, payload)
      } catch (err) {
        console.error(
          `[SubscriptionRecovery] Failed to restore ${domain}:`,
          err,
        )
      }
    }),
  )
}
