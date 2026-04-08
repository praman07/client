import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserProfilePanelState {
  isOpen: boolean
  userId: string | null
}

const initialState: UserProfilePanelState = {
  isOpen: false,
  userId: null,
}

export const userProfilePanelSlice = createSlice({
  name: 'userProfilePanel',
  initialState,
  reducers: {
    openUserProfilePanel: (state, action: PayloadAction<string>) => {
      state.isOpen = true
      state.userId = action.payload
    },
    closeUserProfilePanel: (state) => {
      state.isOpen = false
      state.userId = null
    },
  },
  selectors: {
    selectIsUserProfilePanelOpen: (state) => state.isOpen,
    selectUserProfilePanelUserId: (state) => state.userId,
  },
})

export const { openUserProfilePanel, closeUserProfilePanel } =
  userProfilePanelSlice.actions

export const {
  selectIsUserProfilePanelOpen,
  selectUserProfilePanelUserId,
} = userProfilePanelSlice.selectors

export const userProfilePanelReducer = userProfilePanelSlice.reducer
