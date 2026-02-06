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
export { registerDomain } from './events/domain-registry'
export { registerPriorityRule, clearPriorityRules } from './core/message-queue'
export type { PriorityRule } from './core/message-queue'

// Core types
export type { ConnectionStatus } from './core/connection-manager'
export type { SubscriptionFactory } from './subscriptions/subscription-manager'
