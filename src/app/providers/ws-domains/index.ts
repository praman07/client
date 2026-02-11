/**
 * WS DOMAINS: Exported modules for domain plugin system
 */

export { DomainRegistry } from './registry'
export { createChatPlugin } from './chat-plugin'
export { createWhiteboardPlugin } from './whiteboard-plugin'

// Re-export from shared for convenience
export type { DomainPlugin } from '@/shared/ws/domains'
export { createDomainPlugin } from '@/shared/ws/domains'
