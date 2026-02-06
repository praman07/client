import { createSlice } from '@reduxjs/toolkit'
import { ChannelSettingsTab } from './types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ChannelSettingsState } from './types'

const initialState: ChannelSettingsState = {
  isOpen: false,
  channelId: null,
  activeTab: ChannelSettingsTab.ABOUT,
}

const channelSettingsSlice = createSlice({
  name: 'channelSettings',
  initialState,
  reducers: {
    open: (state, action: PayloadAction<string>) => {
      state.isOpen = true
      state.channelId = action.payload
      state.activeTab = ChannelSettingsTab.ABOUT
    },
    close: (state) => {
      state.isOpen = false
      state.channelId = null
    },
    setActiveTab: (state, action: PayloadAction<ChannelSettingsTab>) => {
      state.activeTab = action.payload
    },
  },
})

export const channelSettingsActions = channelSettingsSlice.actions
export const channelSettingsReducer = channelSettingsSlice.reducer
