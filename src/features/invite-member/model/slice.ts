import { createSlice } from '@reduxjs/toolkit'

interface InviteMemberModalState {
  isOpen: boolean
}

export const inviteMemberSlice = createSlice({
  name: 'inviteMember',
  initialState: { isOpen: false } as InviteMemberModalState,
  reducers: {
    openInviteMemberModal: (state) => {
      state.isOpen = true
    },
    closeInviteMemberModal: (state) => {
      state.isOpen = false
    },
  },
  selectors: {
    selectIsInviteMemberModalOpen: (state) => state.isOpen,
  },
})

export const { openInviteMemberModal, closeInviteMemberModal } =
  inviteMemberSlice.actions

export const { selectIsInviteMemberModalOpen } = inviteMemberSlice.selectors

export default inviteMemberSlice.reducer
