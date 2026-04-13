import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { NotificationSummary } from '@/gql/graphql';

export interface NotificationItem {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  createdAt: string
  actorId?: string
  actorName?: string
  metadata?: Record<string, unknown>
}

interface NotificationState {
  summary: NotificationSummary | null;
  pendingMode: string | null;
  isDndPending: boolean;
  error: string | null;
  items: Array<NotificationItem>
  unreadCount: number
}

const initialState: NotificationState = {
  summary: null,
  pendingMode: null,
  isDndPending: false,
  error: null,
  items: [],
  unreadCount: 0,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationSummary: (state, action: PayloadAction<NotificationSummary>) => {
      state.summary = action.payload;
      state.error = null;
    },

    setGlobalModeOptimistic: (state, action: PayloadAction<string>) => {
      state.pendingMode = action.payload;
      if (state.summary) {
        state.summary.globalMode = action.payload as NotificationSummary['globalMode'];
      }
    },

    clearPendingMode: (state) => {
      state.pendingMode = null;
    },

    setDndPending: (state, action: PayloadAction<boolean>) => {
      state.isDndPending = action.payload;
      if (state.summary) {
        state.summary.isDndActive = action.payload;
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    resetNotificationState: () => initialState,

    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      const exists = state.items.some(item => item.id === action.payload.id)
      if (!exists) {
        state.items.unshift(action.payload)
        if (!action.payload.read) {
          state.unreadCount += 1
        }
      }
    },

    markNotificationRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item && !item.read) {
        item.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },

    markAllNotificationsRead: (state) => {
      state.items.forEach(item => { item.read = true })
      state.unreadCount = 0
    },

    setNotifications: (state, action: PayloadAction<Array<NotificationItem>>) => {
      state.items = action.payload
      state.unreadCount = action.payload.filter(i => !i.read).length
    },

    incrementUnreadCount: (state) => {
      state.unreadCount += 1
    },
  },
});

export const {
  setNotificationSummary,
  setGlobalModeOptimistic,
  clearPendingMode,
  setDndPending,
  setError,
  resetNotificationState,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  setNotifications,
  incrementUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
