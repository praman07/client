import { createSlice } from '@reduxjs/toolkit'

const createProjectRoleSlice = createSlice({
  name: 'createProjectRole',
  initialState: { isOpen: false },
  reducers: {
    openCreateRoleDialog: (state) => {
      state.isOpen = true
    },
    closeCreateRoleDialog: (state) => {
      state.isOpen = false
    },
  },
  selectors: {
    selectIsCreateRoleDialogOpen: (state) => state.isOpen,
  },
})

export const { openCreateRoleDialog, closeCreateRoleDialog } =
  createProjectRoleSlice.actions
export const { selectIsCreateRoleDialogOpen } = createProjectRoleSlice.selectors
export const createProjectRoleReducer = createProjectRoleSlice.reducer
