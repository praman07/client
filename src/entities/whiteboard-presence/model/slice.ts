import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { assignColor } from '../lib/color-assignment'
import { createLogger } from '@/shared/lib/logger'
import type {
  WhiteboardPresenceState,
  CollaboratorPresence,
  CursorPosition,
} from './types'

const log = createLogger('whiteboard:presence')

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
      log.debug('🔄 Setting active collaborators', {
        count: action.payload.length,
        userIds: action.payload.map((c) => c.userId),
      })

      state.remoteCursors = {}
      action.payload.forEach((collab) => {
        const color = assignColor(collab.userId)
        state.remoteCursors[collab.userId] = {
          ...collab,
          color,
        }
        log.debug(
          `  ✅ Added collaborator: ${collab.fullName} (${collab.userId}) color=${color}`,
        )
      })
      state.totalCount = action.payload.length

      log.debug('✅ Active collaborators set', { totalCount: state.totalCount })
    },

    addCollaborator(
      state,
      action: PayloadAction<Omit<CollaboratorPresence, 'color'>>,
    ) {
      const collab = action.payload
      const color = assignColor(collab.userId)

      log.debug('➕ Adding new collaborator', {
        userId: collab.userId,
        fullName: collab.fullName,
        avatarUrl: collab.avatarUrl,
        color,
        previousCount: state.totalCount,
      })

      state.remoteCursors[collab.userId] = {
        ...collab,
        color,
      }
      state.totalCount++

      log.debug('✅ Collaborator added', {
        totalCount: state.totalCount,
        allUserIds: Object.keys(state.remoteCursors),
      })
    },

    removeCollaborator(state, action: PayloadAction<{ userId: string }>) {
      const { userId } = action.payload
      const removed = state.remoteCursors[userId]

      log.debug('➖ Removing collaborator', {
        userId,
        fullName: removed?.fullName,
        previousCount: state.totalCount,
      })

      delete state.remoteCursors[userId]
      state.totalCount--

      log.debug('✅ Collaborator removed', { totalCount: state.totalCount })
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
