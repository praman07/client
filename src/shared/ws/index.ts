/**
 * WebSocket Transport Layer - Public API
 *
 * Exports:
 * - Manager facade (wsManager, createWSManager)
 * - Core protocol types (ClientMessage, ServerMessage)
 * - Event infrastructure (eventRouter, eventBus, domainRegistry)
 * - Type definitions
 */

// Manager (primary API)
export { wsManager, createWSManager } from './manager'
export type { WSManager } from './manager'

// Protocol types
export * from './protocol'

// Event infrastructure
export { eventRouter } from './event-router'
export { dispatchEvent } from './event-bus'
export * from './events/domain-registry'

// Core types
export type { ConnectionStatus } from './core/connection-manager'
export type { SubscriptionFactory } from './subscriptions/subscription-manager'
