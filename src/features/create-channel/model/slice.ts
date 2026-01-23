import { createSlice } from '@reduxjs/toolkit'

interface CreateChannelState {
  isOpen: boolean
}

const initialState: CreateChannelState = {
  isOpen: false,
}

export const createChannelSlice = createSlice({
  name: 'createChannel',
  initialState,
  reducers: {
    openCreateChannelModal: (state) => {
      state.isOpen = true
    },
    closeCreateChannelModal: (state) => {
      state.isOpen = false
    },
  },
})

export const { openCreateChannelModal, closeCreateChannelModal } =
  createChannelSlice.actions

export const createChannelReducer = createChannelSlice.reducer

export const selectIsCreateChannelModalOpen = (state: {
  createChannel: CreateChannelState
}) => state.createChannel.isOpen
