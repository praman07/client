import { createSlice } from '@reduxjs/toolkit'

const createProjectRoleSlice = createSlice({
  name: 'createProjectRole',
  initialState: { isOpen: false },
  reducers: {
    openCreateProjectRoleDialog: (state) => {
      state.isOpen = true
    },
    closeCreateProjectRoleDialog: (state) => {
      state.isOpen = false
    },
  },
  selectors: {
    selectIsCreateProjectRoleDialogOpen: (state) => state.isOpen,
  },
})

export const {
  openCreateProjectRoleDialog,
  closeCreateProjectRoleDialog,
} = createProjectRoleSlice.actions
export const { selectIsCreateProjectRoleDialogOpen } =
  createProjectRoleSlice.selectors
export const createProjectRoleReducer = createProjectRoleSlice.reducer