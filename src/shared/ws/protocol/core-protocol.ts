/**
 * CORE PROTOCOL: Generic WebSocket message envelopes
 *
 * Responsibility:
 * - Define structure of client→server and server→client messages
 * - Provide generic envelope typing (domain-agnostic)
 * - NO domain-specific event types or payloads
 *
 * Domain-specific types belong in:
 * - shared/contracts/chat/protocol.ts
 * - shared/contracts/pages/protocol.ts
 * - etc.
 */

// --- Generic Envelopes ---

/**
 * Client→Server message structure.
 */
export interface ClientMessage<T = unknown> {
  id: string // Request ID (UUID)
  type: string // Event type (e.g., "chat:send-message")
  payload: T
  headers?: {
    traceId?: string
  }
}

/**
 * Server→Client message structure.
 */
export interface ServerMessage<T = unknown> {
  id?: string // Correlation ID (matches client request)
  type: string // Event type (e.g., "chat:new-message")
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  meta?: {
    serverTimestamp: string // ISO 8601
  }
}

/**
 * Union of all possible WebSocket messages (for parsing).
 */
export type ProtocolEnvelope = ClientMessage | ServerMessage

// --- Error Codes (Domain-Agnostic) ---

export enum WSErrorCode {
  AUTH_FAILED = 'AUTH_FAILED',
  RATE_LIMITED = 'RATE_LIMITED',
  INVALID_PAYLOAD = 'INVALID_PAYLOAD',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// --- Connection States ---

export type ConnectionState =
  | 'IDLE' // Not connected
  | 'CONNECTING' // Connection in progress
  | 'CONNECTED' // Active connection
  | 'RECONNECTING' // Attempting reconnect
  | 'OFFLINE' // Max reconnect attempts or auth failure
