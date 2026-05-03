// ──────────────────────────────────────────────────────────────────────────────
// Conversation Entity - Public API
// All imports from this entity must go through this file (FSD rule)
// ──────────────────────────────────────────────────────────────────────────────

// API
export { GET_USER_CONVERSATIONS, CONVERSATION_FIELDS_FRAGMENT } from './api'
export { conversationKeys, ConversationType } from './api'

// Model
export { conversationSlice } from './model'
export * from './model/selectors'
export type {
  Conversation,
  ConversationMember,
  ConversationDetail,
  ConversationNotifPreference,
} from './model/types'

// Hooks
export {
  useUserConversations,
  useConversation,
  useActiveConversation,
} from './hooks'

// Helpers
export { sortConversations, filterByType } from './lib'
