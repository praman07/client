import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatSessionState, ChannelSessionState } from './types'
import { Message } from '@/entities/message/model/types'
import { resequenceMessage } from '../lib/resequencer'

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

    processIncomingMessage: (
      state,
      action: PayloadAction<{ channelId: string; message: Message }>,
    ) => {
      const { channelId, message } = action.payload
      const session = state.sessions[channelId]

      if (!session) return // Ignore messages for unknown channels (or auto-init?)

      const changes = resequenceMessage(session, message)

      // Apply pure changes to state
      Object.assign(session, changes)
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
  processIncomingMessage,
  setConnectionState,
  forceSync,
} = chatSessionSlice.actions
export default chatSessionSlice.reducer
