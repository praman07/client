import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Channel } from './types'

interface ChannelState {
  channels: Record<string, Channel>
  activeChannelId: string | null
}

const initialState: ChannelState = {
  channels: {},
  activeChannelId: null,
}

export const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<Array<Channel>>) => {
      const list = action.payload
      state.channels = {} // Reset or merge? Usually reset on full list fetch is safer for "My Channels"
      list.forEach((channel) => {
        state.channels[channel.id] = channel
      })
    },
    upsertChannel: (state, action: PayloadAction<Channel>) => {
      state.channels[action.payload.id] = action.payload
    },
    removeChannel: (state, action: PayloadAction<string>) => {
      delete state.channels[action.payload]
    },
    setActiveChannel: (state, action: PayloadAction<string | null>) => {
      state.activeChannelId = action.payload
    },
  },
})

export const { setChannels, upsertChannel, removeChannel, setActiveChannel } =
  channelSlice.actions
export default channelSlice.reducer
