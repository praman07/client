import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Project } from './types'

interface ProjectState {
  currentProject: Project | null
  recentProjects: Array<Project>
}

const initialState: ProjectState = {
  currentProject: null,
  recentProjects: [],
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload
      if (action.payload) {
        // Add to recent if not exists
        const exists = state.recentProjects.some(
          (p) => p.id === action.payload!.id,
        )
        if (!exists) {
          state.recentProjects.unshift(action.payload)
          // Keep max 5
          if (state.recentProjects.length > 5) {
            state.recentProjects.pop()
          }
        }
      }
    },
    clearCurrentProject: (state) => {
      state.currentProject = null
    },
  },
})

export const { setCurrentProject, clearCurrentProject } = projectSlice.actions
export default projectSlice.reducer
