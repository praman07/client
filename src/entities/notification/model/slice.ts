import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { NotificationSummary } from '@/gql/graphql';

interface NotificationState {
  summary: NotificationSummary | null;
  pendingMode: string | null;
  isDndPending: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  summary: null,
  pendingMode: null,
  isDndPending: false,
  error: null,
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
  },
});

export const {
  setNotificationSummary,
  setGlobalModeOptimistic,
  clearPendingMode,
  setDndPending,
  setError,
  resetNotificationState,
} = notificationSlice.actions;

export default notificationSlice.reducer;