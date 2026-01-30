/**
 * Chat Events Feature: Public API
 *
 * FSD Structure:
 * - api/: Public actions (sendMessage)
 * - lib/: Internal logic (handlers, workers, registration)
 * - model/: Types and interfaces
 */

// Public API - sendMessage action
export { sendMessage } from './api'

// Internal exports for domain plugin
export { registerChatHandlers } from './lib/register-handlers'
export type { ChatEventHandlerContext } from './model'
