/**
 * Toast Notification Framework
 * 
 * Config-driven, scalable toast notification system.
 * 
 * @example
 * import { showToast, showToastFromEvent } from '@/shared/ui/toast'
 * 
 * // Direct usage
 * showToast({
 *   id: 'msg-123',
 *   variant: 'mention',
 *   title: 'John mentioned you',
 *   user: { id: '1', name: 'John' },
 * })
 * 
 * // Registry-based (for event handlers)
 * showToastFromEvent('chat.message.mention', payload)
 */

// Core types
export type { ToastData, ToastVariant, ToastConfigEntry, ToastUser, ToastNavigation } from './types'

// Config registry
export { registerToastConfig, getToastConfig, TOAST_REGISTRY } from './types'

// Toast show functions
export { showToast, showToastFromEvent, toasts } from './toast'

// Enricher helpers (for custom enrichers)
export { enrichChatMessageNew, enrichChatMention, enrichChatReply } from './enricher'
export { getConversationName, getActorFromCache } from './enricher'
