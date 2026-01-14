import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface SessionState {
  token: string | null
  isAuthenticated: boolean
}

const initialState: SessionState = {
  token: null,
  isAuthenticated: false,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    clearSession: (state) => {
      state.token = null
      state.isAuthenticated = false
    },
  },
})

export const { setSession, clearSession } = sessionSlice.actions
export default sessionSlice.reducer
