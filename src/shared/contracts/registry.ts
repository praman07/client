/**
 * CENTRALIZED CONTRACT REGISTRY
 *
 * Single source of truth for all WebSocket event contracts across all domains.
 *
 * ## Overview
 *
 * This registry provides:
 * - Type-safe event names (enums instead of string literals)
 * - Complete payload type definitions
 * - Domain-organized contracts (chat, whiteboard, presence)
 * - Backward compatibility with legacy imports
 *
 * ## Architecture
 *
 * Each domain has its own folder with 4 files:
 * - `events.ts` - Event name enums (ChatUpstreamEvent, ChatDownstreamEvent)
 * - `upstream.ts` - Client → Server contracts
 * - `downstream.ts` - Server → Client contracts
 * - `index.ts` - Domain public API
 *
 * ## Usage Examples
 *
 * ### Option 1: Import via Registry Namespace (Recommended)
 * ```typescript
 * import { Chat } from '@/shared/contracts/registry'
 *
 * // Access event enums
 * const eventName = Chat.Events.Downstream.NewMessage // 'chat:new-message'
 *
 * // Access types
 * const payload: Chat.NewMessagePayload = {
 *   messageId: 'msg-123',
 *   streamId: 'stream-abc',
 *   dedupeId: 'dedup-xyz',
 *   conversationId: 'conv-1',
 *   authorId: 'user-1',
 *   content: 'Hello!',
 *   createdAt: new Date().toISOString(),
 *   sequence: 42,
 * }
 *
 * // Register handler
 * registerHandler<Chat.NewMessageEvent>(
 *   Chat.Events.Downstream.NewMessage,
 *   async (event) => {
 *     console.log(event.payload.content) // Fully typed!
 *   }
 * )
 * ```
 *
 * ### Option 2: Direct Import (For Performance)
 * ```typescript
 * import { ChatDownstreamEvent } from '@/shared/contracts/chat/events'
 * import type { NewMessagePayload } from '@/shared/contracts/chat/downstream'
 *
 * registerHandler<NewMessagePayload>(
 *   ChatDownstreamEvent.NewMessage,
 *   async (event) => {
 *     // handler logic
 *   }
 * )
 * ```
 *
 * ### Option 3: Domain Index (Balance)
 * ```typescript
 * import { ChatDownstreamEvent, type NewMessagePayload } from '@/shared/contracts/chat'
 * ```
 *
 * ## Benefits
 *
 * - ✅ **Type Safety**: Compile-time checking, no typos
 * - ✅ **Autocomplete**: IDE suggests available events
 * - ✅ **Discoverability**: Browse all events in one place
 * - ✅ **Consistency**: Single source of truth
 * - ✅ **Scalability**: Easy to add new domains
 * - ✅ **Maintainability**: Small files (<150 lines each)
 *
 * @module shared/contracts/registry
 * @see {@link file://./chat/index.ts} for chat domain contracts
 * @see {@link file://./whiteboard/index.ts} for whiteboard contracts
 * @see {@link file://./presence/index.ts} for presence contracts
 */

// ═══════════════════════════════════════════════════════════════
// DOMAIN NAMESPACES
// ═══════════════════════════════════════════════════════════════

export * as Chat from './chat'

// ═══════════════════════════════════════════════════════════════
// SHARED TYPES
// ═══════════════════════════════════════════════════════════════

export type {
  UpstreamContract,
  DownstreamContract,
  ServerResponse,
  DomainPrefix,
  EventName,
} from './types'

// ═══════════════════════════════════════════════════════════════
// EVENT TYPE RE-EXPORTS (for convenience)
// ============================================================================
// Helper Functions
// ============================================================================

export type {
  ChatUpstreamEvent,
  ChatDownstreamEvent,
  ChatUpstreamContract,
  ChatDownstreamContract,
} from './chat'

/**
 * Validates if an event type string belongs to a registered domain.
 *
 * Checks if the event follows the `domain:action` pattern and belongs to
 * one of the registered domains (chat, whiteboard, presence).
 *
 * @param eventType - Full event type string (e.g., 'chat:new-message')
 * @returns True if event belongs to a registered domain, false otherwise
 *
 * @example
 * ```typescript
 * isValidEvent('chat:new-message') // true
 * isValidEvent('whiteboard:draw') // true
 * isValidEvent('unknown:event') // false
 * isValidEvent('invalid-format') // false
 * isValidEvent('') // false
 * ```
 */
export function isValidEvent(eventType: string): boolean {
  const domain = getDomain(eventType)
  return domain !== null
}

/**
 * Extracts the domain prefix from an event type string.
 *
 * Parses event type in format `domain:action` and returns the domain
 * prefix if it matches one of the registered domains.
 *
 * @param eventType - Full event type string (e.g., 'chat:new-message')
 * @returns Domain prefix ('chat', 'whiteboard', or 'presence'), or null if invalid
 *
 * @example
 * ```typescript
 * getDomain('chat:new-message') // 'chat'
 * getDomain('whiteboard:draw') // 'whiteboard'
 * getDomain('presence:update') // 'presence'
 * getDomain('unknown:event') // null
 * getDomain('invalid-format') // null
 * getDomain('chat') // null (missing action)
 * ```
 */
export function getDomain(
  eventType: string,
): import('./types').DomainPrefix | null {
  const [domain] = eventType.split(':')
  if (domain === 'chat' || domain === 'whiteboard' || domain === 'presence') {
    return domain as import('./types').DomainPrefix
  }
  return null
}
