import { createSlice } from '@reduxjs/toolkit'

interface CreateDmState {
  isOpen: boolean
}

const initialState: CreateDmState = {
  isOpen: false,
}

export const createDmSlice = createSlice({
  name: 'createDm',
  initialState,
  reducers: {
    openCreateDmModal: (state) => {
      state.isOpen = true
    },
    closeCreateDmModal: (state) => {
      state.isOpen = false
    },
  },
})

export const { openCreateDmModal, closeCreateDmModal } = createDmSlice.actions
export const createDmReducer = createDmSlice.reducer

export const selectIsCreateDmModalOpen = (state: { createDm: CreateDmState }) =>
  state.createDm.isOpen
