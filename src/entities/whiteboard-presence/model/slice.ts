import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { assignColor } from '../lib/color-assignment'
import type {
  WhiteboardPresenceState,
  CollaboratorPresence,
  CursorPosition,
} from './types'

const initialState: WhiteboardPresenceState = {
  remoteCursors: {},
  totalCount: 0,
}

export const whiteboardPresenceSlice = createSlice({
  name: 'whiteboardPresence',
  initialState,
  reducers: {
    setActiveCollaborators(
      state,
      action: PayloadAction<Omit<CollaboratorPresence, 'color'>[]>,
    ) {
      state.remoteCursors = {}
      action.payload.forEach((collab) => {
        state.remoteCursors[collab.userId] = {
          ...collab,
          color: assignColor(collab.userId),
        }
      })
      state.totalCount = action.payload.length
    },

    addCollaborator(
      state,
      action: PayloadAction<Omit<CollaboratorPresence, 'color'>>,
    ) {
      const collab = action.payload
      state.remoteCursors[collab.userId] = {
        ...collab,
        color: assignColor(collab.userId),
      }
      state.totalCount++
    },

    removeCollaborator(state, action: PayloadAction<{ userId: string }>) {
      delete state.remoteCursors[action.payload.userId]
      state.totalCount--
    },

    updateCursorPosition(
      state,
      action: PayloadAction<{ userId: string; cursor: CursorPosition }>,
    ) {
      const { userId, cursor } = action.payload
      if (state.remoteCursors[userId]) {
        state.remoteCursors[userId].cursor = cursor
      }
    },

    setDrawingState(
      state,
      action: PayloadAction<{ userId: string; isDrawing: boolean }>,
    ) {
      const { userId, isDrawing } = action.payload
      if (state.remoteCursors[userId]) {
        state.remoteCursors[userId].isDrawing = isDrawing
      }
    },

    setUserIdle(state, action: PayloadAction<{ userId: string }>) {
      const { userId } = action.payload
      if (state.remoteCursors[userId]) {
        state.remoteCursors[userId].isIdle = true
      }
    },

    setUserActive(state, action: PayloadAction<{ userId: string }>) {
      const { userId } = action.payload
      if (state.remoteCursors[userId]) {
        state.remoteCursors[userId].isIdle = false
      }
    },

    clearAllCursors(state) {
      state.remoteCursors = {}
      state.totalCount = 0
    },
  },
})

export const {
  setActiveCollaborators,
  addCollaborator,
  removeCollaborator,
  updateCursorPosition,
  setDrawingState,
  setUserIdle,
  setUserActive,
  clearAllCursors,
} = whiteboardPresenceSlice.actions

export default whiteboardPresenceSlice.reducer
