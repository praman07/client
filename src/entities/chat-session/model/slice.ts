import { createSlice } from '@reduxjs/toolkit'
// Removed resequencer import - logic moves to Feature pipeline
import type { ChannelSessionState, ChatSessionState } from './types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Message } from '@/entities/message/model/types'

const initialState: ChatSessionState = {
  sessions: {},
  globalConnectionState: 'disconnected',
}

const initialChannelState: ChannelSessionState = {
  channelId: '',
  expectedStreamId: null,
  buffer: {},
  status: 'IN_SYNC',
  lastAppliedMessageId: null,
  stats: {
    bufferedCount: 0,
    lastReceiveTs: 0,
    gapDetectedAt: null,
  },
}

export const chatSessionSlice = createSlice({
  name: 'chatSession',
  initialState,
  reducers: {
    initChannel: (
      state,
      action: PayloadAction<{ channelId: string; initialStreamId?: string }>,
    ) => {
      const { channelId, initialStreamId } = action.payload
      if (!state.sessions[channelId]) {
        state.sessions[channelId] = {
          ...initialChannelState,
          channelId,
          expectedStreamId: initialStreamId || null,
        }
      }
    },

    // processIncomingMessage REMOVED.
    // The Feature layer (Pipeline) handles resequencing logic and writes to Dexie.
    // It then calls `updateCursor` or `bufferMessage` here to update Redux metadata.

    updateExpectedStreamId: (
      state,
      action: PayloadAction<{ channelId: string; nextExpectedId: string }>,
    ) => {
      const session = state.sessions[action.payload.channelId]
      if (session) {
        session.expectedStreamId = action.payload.nextExpectedId
        session.lastAppliedMessageId = null // We don't need this in Redux anymore really
        session.status = 'IN_SYNC'
      }
    },

    bufferMessage: (
      state,
      action: PayloadAction<{
        channelId: string
        streamId: string
        message: Message
      }>,
    ) => {
      const { channelId, streamId, message } = action.payload
      const session = state.sessions[channelId]
      if (session) {
        session.buffer[streamId] = message
        session.status = 'RECOVERING'
        session.stats.bufferedCount = Object.keys(session.buffer).length
        session.stats.gapDetectedAt = Date.now()
      }
    },

    setConnectionState: (
      state,
      action: PayloadAction<ChatSessionState['globalConnectionState']>,
    ) => {
      state.globalConnectionState = action.payload
    },

    forceSync: (state, action: PayloadAction<{ channelId: string }>) => {
      const session = state.sessions[action.payload.channelId]
      if (session) {
        session.status = 'DESYNCED'
      }
    },
  },
})

export const {
  initChannel,
  updateExpectedStreamId,
  bufferMessage,
  setConnectionState,
  forceSync,
} = chatSessionSlice.actions
export default chatSessionSlice.reducer
