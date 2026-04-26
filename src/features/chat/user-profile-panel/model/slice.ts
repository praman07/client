import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserProfilePanelState {
  isOpen: boolean
  userId: string | null
  projectId: string | null
}

const initialState: UserProfilePanelState = {
  isOpen: false,
  userId: null,
  projectId: null,
}

export const userProfilePanelSlice = createSlice({
  name: 'userProfilePanel',
  initialState,
  reducers: {
    openUserProfilePanel: (state, action: PayloadAction<{ userId: string; projectId: string }>) => {
      state.isOpen = true
      state.userId = action.payload.userId
      state.projectId = action.payload.projectId
    },
    closeUserProfilePanel: (state) => {
      state.isOpen = false
      state.userId = null
      state.projectId = null
    },
  },
  selectors: {
    selectIsUserProfilePanelOpen: (state) => state.isOpen,
    selectUserProfilePanelUserId: (state) => state.userId,
    selectUserProfilePanelProjectId: (state) => state.projectId,
  },
})

export const { openUserProfilePanel, closeUserProfilePanel } =
  userProfilePanelSlice.actions

export const {
  selectIsUserProfilePanelOpen,
  selectUserProfilePanelUserId,
  selectUserProfilePanelProjectId,
} = userProfilePanelSlice.selectors

export const userProfilePanelReducer = userProfilePanelSlice.reducer
