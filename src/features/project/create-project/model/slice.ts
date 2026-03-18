import { createSlice } from '@reduxjs/toolkit'
import type { CreateProjectModalState } from './types'

const initialState: CreateProjectModalState = {
  isOpen: false,
}

export const createProjectSlice = createSlice({
  name: 'createProject',
  initialState,
  reducers: {
    openCreateProjectModal: (state) => {
      state.isOpen = true
    },
    closeCreateProjectModal: (state) => {
      state.isOpen = false
    },
    toggleCreateProjectModal: (state) => {
      state.isOpen = !state.isOpen
    },
  },
  selectors: {
    selectIsCreateProjectModalOpen: (state) => state.isOpen,
  },
})

export const {
  openCreateProjectModal,
  closeCreateProjectModal,
  toggleCreateProjectModal,
} = createProjectSlice.actions

export const { selectIsCreateProjectModalOpen } = createProjectSlice.selectors
export default createProjectSlice.reducer
