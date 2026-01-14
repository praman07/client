import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { WorkspacePartial } from './types'

interface WorkspaceState {
  myWorkspaces: Array<WorkspacePartial>
  currentWorkspaceId: string | null
}

const initialState: WorkspaceState = {
  myWorkspaces: [],
  currentWorkspaceId: null,
}

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setMyWorkspaces: (
      state,
      action: PayloadAction<Array<WorkspacePartial>>,
    ) => {
      state.myWorkspaces = action.payload
    },
    setCurrentWorkspaceId: (state, action: PayloadAction<string | null>) => {
      state.currentWorkspaceId = action.payload
    },
    addWorkspace: (state, action: PayloadAction<WorkspacePartial>) => {
      state.myWorkspaces.push(action.payload)
    },
    updateWorkspace: (state, action: PayloadAction<WorkspacePartial>) => {
      const index = state.myWorkspaces.findIndex(
        (w) => w.id === action.payload.id,
      )
      if (index !== -1) {
        state.myWorkspaces[index] = action.payload
      }
    },
  },
})

export const {
  setMyWorkspaces,
  setCurrentWorkspaceId,
  addWorkspace,
  updateWorkspace,
} = workspaceSlice.actions
export default workspaceSlice.reducer
