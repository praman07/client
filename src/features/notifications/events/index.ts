/**
 * Notifications Events Feature: Public API
 * 
 * FSD Structure:
 * - lib/handlers/: Event handler implementations (one file per event)
 * - model/: Types and interfaces
 */

export type { NotificationEventHandlerContext } from './model/types'

export { registerNotificationHandlers } from './lib/register-handlers'
