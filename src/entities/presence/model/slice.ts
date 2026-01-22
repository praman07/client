import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PresenceState, UserPresenceStatus } from './types'

const initialState: PresenceState = {
  users: {},
  lastUpdated: Date.now(),
}

export const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    updateUserPresence: (
      state,
      action: PayloadAction<{ userId: string; status: UserPresenceStatus }>,
    ) => {
      state.users[action.payload.userId] = action.payload.status
      state.lastUpdated = Date.now()
    },

    // Batch update (e.g., initial hydration)
    hydratePresence: (
      state,
      action: PayloadAction<Record<string, UserPresenceStatus>>,
    ) => {
      Object.assign(state.users, action.payload)
      state.lastUpdated = Date.now()
    },
  },
})

export const { updateUserPresence, hydratePresence } = presenceSlice.actions
export default presenceSlice.reducer
