import { createSlice } from '@reduxjs/toolkit'

const createWorkspaceRoleSlice = createSlice({
  name: 'createWorkspaceRole',
  initialState: { isOpen: false },
  reducers: {
    openCreateWorkspaceRoleDialog: (state) => {
      state.isOpen = true
    },
    closeCreateWorkspaceRoleDialog: (state) => {
      state.isOpen = false
    },
  },
  selectors: {
    selectIsCreateWorkspaceRoleDialogOpen: (state) => state.isOpen,
  },
})

export const { openCreateWorkspaceRoleDialog, closeCreateWorkspaceRoleDialog } =
  createWorkspaceRoleSlice.actions
export const { selectIsCreateWorkspaceRoleDialogOpen } =
  createWorkspaceRoleSlice.selectors
export const createWorkspaceRoleReducer = createWorkspaceRoleSlice.reducer
