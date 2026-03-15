import { createSlice } from '@reduxjs/toolkit'

const addProjectMemberSlice = createSlice({
  name: 'addProjectMember',
  initialState: { isOpen: false },
  reducers: {
    openAddMemberDialog: (state) => {
      state.isOpen = true
    },
    closeAddMemberDialog: (state) => {
      state.isOpen = false
    },
  },
  selectors: {
    selectIsAddMemberDialogOpen: (state) => state.isOpen,
  },
})

export const { openAddMemberDialog, closeAddMemberDialog } =
  addProjectMemberSlice.actions
export const { selectIsAddMemberDialogOpen } = addProjectMemberSlice.selectors
export const addProjectMemberReducer = addProjectMemberSlice.reducer
