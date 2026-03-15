import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UpdateProjectRoleState {
  isOpen: boolean
  roleId: string | null
}

const updateProjectRoleSlice = createSlice({
  name: 'updateProjectRole',
  initialState: { isOpen: false, roleId: null } as UpdateProjectRoleState,
  reducers: {
    openUpdateRoleDialog: (state, action: PayloadAction<string>) => {
      state.isOpen = true
      state.roleId = action.payload
    },
    closeUpdateRoleDialog: (state) => {
      state.isOpen = false
      state.roleId = null
    },
  },
  selectors: {
    selectIsUpdateRoleDialogOpen: (state) => state.isOpen,
    selectUpdateRoleId: (state) => state.roleId,
  },
})

export const { openUpdateRoleDialog, closeUpdateRoleDialog } =
  updateProjectRoleSlice.actions
export const { selectIsUpdateRoleDialogOpen, selectUpdateRoleId } =
  updateProjectRoleSlice.selectors
export const updateProjectRoleReducer = updateProjectRoleSlice.reducer
