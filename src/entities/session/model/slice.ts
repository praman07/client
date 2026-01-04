import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  SessionUserFragment,
  SessionWorkspaceFragment,
} from '@/shared/api/graphql/generated/graphql'

interface SessionState {
  currentUser: SessionUserFragment | null
  currentWorkspace: SessionWorkspaceFragment | null
  isLoading: boolean
}

const initialState: SessionState = {
  currentUser: null,
  currentWorkspace: null,
  isLoading: true, // Default to loading until initial auth check clears
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionUser: (
      state,
      action: PayloadAction<SessionUserFragment | null>,
    ) => {
      state.currentUser = action.payload
      // If user is cleared, workspace should likely be cleared too
      if (!action.payload) {
        state.currentWorkspace = null
      }
    },
    setCurrentWorkspace: (
      state,
      action: PayloadAction<SessionWorkspaceFragment | null>,
    ) => {
      state.currentWorkspace = action.payload
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    clearSession: (state) => {
      state.currentUser = null
      state.currentWorkspace = null
      state.isLoading = false
    },
  },
})

export const {
  setSessionUser,
  setCurrentWorkspace,
  setIsLoading,
  clearSession,
} = sessionSlice.actions

export default sessionSlice.reducer
