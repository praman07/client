import { createSlice } from '@reduxjs/toolkit'
import type { ConversationType } from '..'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Conversation, ConversationDetail } from './types'

/**
 * Conversation State
 * Manages current active conversation and conversation cache
 */
interface ConversationState {
  // Normalized conversation cache (keyed by conversation ID)
  conversations: Record<string, Conversation>

  // Current active conversation ID
  activeConversationId: string | null

  // Current active conversation type (for filtering, sidebar highlighting)
  activeConversationType: ConversationType | null

  // Detailed conversation data (with members) for active conversation
  activeConversationDetail: ConversationDetail | null

  // UI state: sidebar filter
  sidebarFilter: ConversationType | 'ALL'
}

const initialState: ConversationState = {
  conversations: {},
  activeConversationId: null,
  activeConversationType: null,
  activeConversationDetail: null,
  sidebarFilter: 'ALL',
}

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    /**
     * Set multiple conversations (from query result)
     * Replaces existing conversations
     */
    setConversations: (state, action: PayloadAction<Array<Conversation>>) => {
      const list = action.payload
      state.conversations = {}
      list.forEach((conversation) => {
        state.conversations[conversation.id] = conversation
      })
    },

    /**
     * Add or update a single conversation
     */
    upsertConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations[action.payload.id] = action.payload
    },

    /**
     * Remove a conversation (soft delete)
     */
    removeConversation: (state, action: PayloadAction<string>) => {
      delete state.conversations[action.payload]

      // Clear active if it was removed
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = null
        state.activeConversationType = null
        state.activeConversationDetail = null
      }
    },

    /**
     * Set active conversation (called when navigating to a conversation)
     */
    setActiveConversation: (
      state,
      action: PayloadAction<{
        conversationId: string
        conversationType: ConversationType
      } | null>,
    ) => {
      if (action.payload) {
        state.activeConversationId = action.payload.conversationId
        state.activeConversationType = action.payload.conversationType
      } else {
        state.activeConversationId = null
        state.activeConversationType = null
        state.activeConversationDetail = null
      }
    },

    /**
     * Set active conversation detail (with members)
     */
    setActiveConversationDetail: (
      state,
      action: PayloadAction<ConversationDetail | null>,
    ) => {
      state.activeConversationDetail = action.payload
    },

    /**
     * Update unread count for a conversation
     */
    updateUnreadCount: (
      state,
      action: PayloadAction<{ conversationId: string; unreadCount: number }>,
    ) => {
      const { conversationId, unreadCount } = action.payload
      if (state.conversations[conversationId]) {
        state.conversations[conversationId].unreadCount = unreadCount
      }
    },

    /**
     * Increment unread count for a conversation
     */
    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload
      if (state.conversations[conversationId]) {
        const current = state.conversations[conversationId].unreadCount || 0
        state.conversations[conversationId].unreadCount = current + 1
      }
    },

    /**
     * Clear unread count (mark as read)
     */
    clearUnreadCount: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload
      if (state.conversations[conversationId]) {
        state.conversations[conversationId].unreadCount = 0
      }
    },

    /**
     * Set sidebar filter (for conversation type filtering)
     */
    setSidebarFilter: (
      state,
      action: PayloadAction<ConversationType | 'ALL'>,
    ) => {
      state.sidebarFilter = action.payload
    },

    /**
     * Reset conversation state (logout, workspace switch)
     */
    resetConversationState: () => initialState,
  },
})

export const {
  setConversations,
  upsertConversation,
  removeConversation,
  setActiveConversation,
  setActiveConversationDetail,
  updateUnreadCount,
  incrementUnreadCount,
  clearUnreadCount,
  setSidebarFilter,
  resetConversationState,
} = conversationSlice.actions

export default conversationSlice.reducer
