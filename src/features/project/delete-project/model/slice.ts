import { createSlice } from '@reduxjs/toolkit'

const deleteProjectSlice = createSlice({
  name: 'deleteProject',
  initialState: { isOpen: false },
  reducers: {
    openDeleteProjectDialog: (state) => {
      state.isOpen = true
    },
    closeDeleteProjectDialog: (state) => {
      state.isOpen = false
    },
  },
  selectors: {
    selectIsDeleteProjectDialogOpen: (state) => state.isOpen,
  },
})

export const { openDeleteProjectDialog, closeDeleteProjectDialog } =
  deleteProjectSlice.actions
export const { selectIsDeleteProjectDialogOpen } = deleteProjectSlice.selectors
export const deleteProjectReducer = deleteProjectSlice.reducer
