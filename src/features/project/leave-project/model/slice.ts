import { createSlice } from '@reduxjs/toolkit'

const leaveProjectSlice = createSlice({
  name: 'leaveProject',
  initialState: { isOpen: false },
  reducers: {
    openLeaveProjectDialog: (state) => {
      state.isOpen = true
    },
    closeLeaveProjectDialog: (state) => {
      state.isOpen = false
    },
  },
  selectors: {
    selectIsLeaveProjectDialogOpen: (state) => state.isOpen,
  },
})

export const { openLeaveProjectDialog, closeLeaveProjectDialog } =
  leaveProjectSlice.actions
export const { selectIsLeaveProjectDialogOpen } = leaveProjectSlice.selectors
export const leaveProjectReducer = leaveProjectSlice.reducer
