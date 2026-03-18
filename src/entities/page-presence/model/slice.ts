import {  createSlice } from '@reduxjs/toolkit'
import { assignColor } from '../lib/color-assignment'
import type {PayloadAction} from '@reduxjs/toolkit';
import type { PageCollaboratorPresence, PagePresenceState } from './types'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:presence')

const initialState: PagePresenceState = {
  collaborators: {},
  totalCount: 0,
}

/**
 * Redux slice for page collaborator presence
 *
 * Tracks who is currently viewing/editing a page in real time.
 * Populated via WS events handled in features/pages/events.
 *
 * Consumed by:
 * - features/pages/events/handlers → setActivePageCollaborators, addPageCollaborator, removePageCollaborator
 * - widgets/page-editor/ui/CollaboratorBar → useActivePageCollaborators hook
 *
 * NOT responsible for cursor rendering — Tiptap's CollaborationCursor extension
 * renders remote cursors directly from the y-protocols Awareness object.
 *
 * @layer Entity
 */
export const pagePresenceSlice = createSlice({
  name: 'pagePresence',
  initialState,
  reducers: {
    /**
     * Set the full collaborator list on subscribe-success.
     * Replaces any existing state (clean slate on each page open).
     */
    setActivePageCollaborators(
      state,
      action: PayloadAction<Array<Omit<PageCollaboratorPresence, 'color'>>>,
    ) {
      state.collaborators = {}
      action.payload.forEach((collab) => {
        state.collaborators[collab.userId] = {
          ...collab,
          color: assignColor(collab.userId),
        }
      })
      state.totalCount = action.payload.length

      log.debug('Active collaborators set', {
        count: state.totalCount,
        userIds: Object.keys(state.collaborators),
      })
    },

    /**
     * Add a single collaborator on user-joined WS event.
     */
    addPageCollaborator(
      state,
      action: PayloadAction<Omit<PageCollaboratorPresence, 'color'>>,
    ) {
      const collab = action.payload
      state.collaborators[collab.userId] = {
        ...collab,
        color: assignColor(collab.userId),
      }
      state.totalCount++

      log.debug('Collaborator joined', {
        userId: collab.userId,
        fullName: collab.fullName,
        totalCount: state.totalCount,
      })
    },

    /**
     * Remove a collaborator on user-left WS event.
     */
    removePageCollaborator(state, action: PayloadAction<{ userId: string }>) {
      const { userId } = action.payload
      const existed = !!state.collaborators[userId]
      delete state.collaborators[userId]
      if (existed) state.totalCount = Math.max(0, state.totalCount - 1)

      log.debug('Collaborator left', {
        userId,
        totalCount: state.totalCount,
      })
    },

    /**
     * Clear all collaborators on unmount / page close.
     */
    clearPageCollaborators(state) {
      state.collaborators = {}
      state.totalCount = 0
    },
  },
})

export const {
  setActivePageCollaborators,
  addPageCollaborator,
  removePageCollaborator,
  clearPageCollaborators,
} = pagePresenceSlice.actions

export default pagePresenceSlice.reducer
