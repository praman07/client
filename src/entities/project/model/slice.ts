import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Project } from './types'

interface ProjectState {
  currentProject: Project | null
  recentProjects: Array<Project>
  currentProjectIsArchived: boolean
}

const initialState: ProjectState = {
  currentProject: null,
  recentProjects: [],
  currentProjectIsArchived: false,
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload
      state.currentProjectIsArchived =
        (action.payload as any)?.isArchived ?? false
      if (action.payload) {
        const exists = state.recentProjects.some(
          (p) => p.id === action.payload!.id,
        )
        if (!exists) {
          state.recentProjects.unshift(action.payload)
          if (state.recentProjects.length > 5) {
            state.recentProjects.pop()
          }
        }
      }
    },
    clearCurrentProject: (state) => {
      state.currentProject = null
      state.currentProjectIsArchived = false
    },
    setCurrentProjectArchived: (state, action: PayloadAction<boolean>) => {
      state.currentProjectIsArchived = action.payload
      if (state.currentProject) {
        state.currentProject = {
          ...state.currentProject,
          ...(action.payload !== undefined
            ? { isArchived: action.payload }
            : {}),
        } as typeof state.currentProject
      }
    },
    removeFromRecent: (state, action: PayloadAction<string>) => {
      state.recentProjects = state.recentProjects.filter(
        (p) => p.id !== action.payload,
      )
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null
        state.currentProjectIsArchived = false
      }
    },
  },
})

export const {
  setCurrentProject,
  clearCurrentProject,
  setCurrentProjectArchived,
  removeFromRecent,
} = projectSlice.actions
export default projectSlice.reducer
