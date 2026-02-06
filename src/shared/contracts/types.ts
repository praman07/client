/**
 * Base contract types for WebSocket communication
 * Single source of truth for event/payload structure
 */

// ═══════════════════════════════════════════════════════════════
// CORE CONTRACT TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Upstream contract (Client → Server)
 * Used for commands sent from client to server
 */
export interface UpstreamContract<TEvent extends string, TPayload> {
  type: TEvent
  payload: TPayload
}

/**
 * Downstream contract (Server → Client)
 * Used for events sent from server to client
 */
export interface DownstreamContract<TEvent extends string, TPayload> {
  type: TEvent
  payload: TPayload
}

// ═══════════════════════════════════════════════════════════════
// RESPONSE ENVELOPE
// ═══════════════════════════════════════════════════════════════

/**
 * Server response envelope for request/response patterns
 */
export interface ServerResponse<TData = unknown> {
  id?: string
  success: boolean
  data?: TData
  error?: {
    code: string
    message: string
  }
}

// ═══════════════════════════════════════════════════════════════
// DOMAIN TYPES
// ═══════════════════════════════════════════════════════════════

/**
 * Supported domain prefixes for event namespacing
 */
export type DomainPrefix = 'chat' | 'whiteboard' | 'presence'

/**
 * Helper type to create properly namespaced event names
 *
 * @example
 * type ChatNewMessage = EventName<'chat', 'new-message'>
 * // Result: 'chat:new-message'
 */
export type EventName<
  TDomain extends DomainPrefix,
  TAction extends string,
> = `${TDomain}:${TAction}`
