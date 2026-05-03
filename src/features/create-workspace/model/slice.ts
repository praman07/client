import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CreateWorkspaceState {
  step: number
  formData: {
    name: string
    slug: string
    logoUrl?: string
  }
}

const initialState: CreateWorkspaceState = {
  step: 1,
  formData: {
    name: '',
    slug: '',
  },
}

export const createWorkspaceSlice = createSlice({
  name: 'createWorkspace',
  initialState,
  reducers: {
    setDetail: (
      state,
      action: PayloadAction<Partial<CreateWorkspaceState['formData']>>,
    ) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
    resetForm: (state) => {
      state.step = 1
      state.formData = initialState.formData
    },
  },
})

export const { setDetail, setStep, resetForm } = createWorkspaceSlice.actions
export default createWorkspaceSlice.reducer
