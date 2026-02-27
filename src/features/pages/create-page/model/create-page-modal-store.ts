import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CreatePageModalState {
  isOpen: boolean
  /** null = create root page; string cuid = create as child of this page */
  parentId: string | null
}

const initialState: CreatePageModalState = {
  isOpen: false,
  parentId: null,
}

export const createPageModalSlice = createSlice({
  name: 'createPageModal',
  initialState,
  reducers: {
    openCreatePageModal: (
      state,
      action: PayloadAction<{ parentId: string | null }>,
    ) => {
      state.isOpen = true
      state.parentId = action.payload.parentId
    },
    closeCreatePageModal: (state) => {
      state.isOpen = false
      state.parentId = null
    },
  },
})

export const { openCreatePageModal, closeCreatePageModal } =
  createPageModalSlice.actions
export const createPageModalReducer = createPageModalSlice.reducer

export const selectIsCreatePageModalOpen = (state: {
  createPageModal: CreatePageModalState
}) => state.createPageModal.isOpen

export const selectCreatePageModalParentId = (state: {
  createPageModal: CreatePageModalState
}) => state.createPageModal.parentId
