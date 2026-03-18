import { createSelector } from '@reduxjs/toolkit'
import type { ConversationType } from '..'
import type { RootState } from '@/app/store'

/**
 * Base selector for conversation domain
 */
const selectConversationDomain = (state: RootState) => state.conversation

// ──────────────────────────────────────────────────────────────────────────────
// Conversation List Selectors
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Select all conversations as array
 */
export const selectAllConversations = createSelector(
  selectConversationDomain,
  (state) => Object.values(state.conversations).filter((c): c is NonNullable<typeof c> => !!c),
)

/**
 * Select conversations by type
 */
export const selectConversationsByType = (type: ConversationType) =>
  createSelector(selectAllConversations, (conversations) =>
    conversations.filter((conv) => conv.type === type),
  )

/**
 * Select all channels
 */
export const selectAllChannels = createSelector(
  selectAllConversations,
  (conversations) => conversations.filter((conv) => conv.type === 'CHANNEL'),
)

/**
 * Select all DMs
 */
export const selectAllDMs = createSelector(
  selectAllConversations,
  (conversations) => conversations.filter((conv) => conv.type === 'DM'),
)

/**
 * Select all group DMs
 */
export const selectAllGroupDMs = createSelector(
  selectAllConversations,
  (conversations) => conversations.filter((conv) => conv.type === 'GROUP_DM'),
)

/**
 * Select all threads
 */
export const selectAllThreads = createSelector(
  selectAllConversations,
  (conversations) => conversations.filter((conv) => conv.type === 'THREAD'),
)

// ──────────────────────────────────────────────────────────────────────────────
// Single Conversation Selectors
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Select conversation by ID
 */
export const selectConversationById = (conversationId: string) =>
  createSelector(
    selectConversationDomain,
    (state) => state.conversations[conversationId],
  )

// ──────────────────────────────────────────────────────────────────────────────
// Active Conversation Selectors
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Select active conversation ID
 */
export const selectActiveConversationId = createSelector(
  selectConversationDomain,
  (state) => state.activeConversationId,
)

/**
 * Select active conversation type
 */
export const selectActiveConversationType = createSelector(
  selectConversationDomain,
  (state) => state.activeConversationType,
)

/**
 * Select active conversation object
 */
export const selectActiveConversation = createSelector(
  selectConversationDomain,
  selectActiveConversationId,
  (state, activeId) => {
    if (!activeId) return null
    return state.conversations[activeId] ?? null
  },
)

/**
 * Select active conversation detail (with members)
 */
export const selectActiveConversationDetail = createSelector(
  selectConversationDomain,
  (state) => state.activeConversationDetail,
)

// ──────────────────────────────────────────────────────────────────────────────
// Unread Count Selectors
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Select total unread count across all conversations
 */
export const selectTotalUnreadCount = createSelector(
  selectAllConversations,
  (conversations) =>
    conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0),
)

/**
 * Select unread count for a specific conversation
 */
export const selectUnreadCountByConversationId = (conversationId: string) =>
  createSelector(
    selectConversationById(conversationId),
    (conversation) => conversation?.unreadCount || 0,
  )

/**
 * Select conversations with unread messages
 */
export const selectConversationsWithUnread = createSelector(
  selectAllConversations,
  (conversations) =>
    conversations.filter((conv) => (conv.unreadCount || 0) > 0),
)

// ──────────────────────────────────────────────────────────────────────────────
// UI State Selectors
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Select sidebar filter
 */
export const selectSidebarFilter = createSelector(
  selectConversationDomain,
  (state) => state.sidebarFilter,
)

/**
 * Select filtered conversations (based on sidebar filter)
 */
export const selectFilteredConversations = createSelector(
  selectAllConversations,
  selectSidebarFilter,
  (conversations, filter) => {
    if (filter === 'ALL') return conversations
    return conversations.filter((conv) => conv.type === filter)
  },
)

// ──────────────────────────────────────────────────────────────────────────────
// Derived Selectors (sorted, grouped, etc.)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Select conversations sorted by priority (unread first, then by last message time)
 */
export const selectConversationsSorted = createSelector(
  selectAllConversations,
  (conversations) => {
    return [...conversations].sort((a, b) => {
      // Unread first
      if (a.unreadCount && !b.unreadCount) return -1
      if (!a.unreadCount && b.unreadCount) return 1

      // Then by last message time or updated time
      const aTime = a.lastMessage?.createdAt || a.updatedAt
      const bTime = b.lastMessage?.createdAt || b.updatedAt

      return new Date(bTime).getTime() - new Date(aTime).getTime()
    })
  },
)

/**
 * Select active conversations (non-archived)
 */
export const selectActiveConversations = createSelector(
  [selectAllConversations],
  (conversations) => conversations.filter((c) => !c.deletedAt),
)

/**
 * Select archived conversations
 */
export const selectArchivedConversations = createSelector(
  [selectAllConversations],
  (conversations) => conversations.filter((conv) => conv.deletedAt),
)
