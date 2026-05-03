import {  createSlice } from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit';
import type { UploadSlot, UploadStatus } from '@/features/vault/upload-file'
import type { RootState } from '@/app/store/config'

interface UploadTrayState {
  slots: Array<UploadSlot>
}

const initialState: UploadTrayState = {
  slots: [],
}

/**
 * RTK slice for the vault upload progress tray.
 * Registered in app store as `uploadTray`.
 *
 * Write side: VaultExplorer dispatches actions on each upload step.
 * Read side:  VaultUploadTray reads via useAppSelector(selectUploadSlots).
 *
 * @layer Widgets — vault-upload-tray
 */
const uploadTraySlice = createSlice({
  name: 'uploadTray',
  initialState,
  reducers: {
    enqueue(state, action: PayloadAction<UploadSlot>) {
      state.slots.push(action.payload)
    },
    setProgress(
      state,
      action: PayloadAction<{ localId: string; percent: number }>,
    ) {
      const slot = state.slots.find((s) => s.localId === action.payload.localId)
      if (slot) slot.progress = action.payload.percent
    },
    setStatus(
      state,
      action: PayloadAction<{
        localId: string
        status: UploadStatus
        error?: string
      }>,
    ) {
      const slot = state.slots.find((s) => s.localId === action.payload.localId)
      if (slot) {
        slot.status = action.payload.status
        if (action.payload.error) slot.error = action.payload.error
      }
    },
    removeSlot(state, action: PayloadAction<string>) {
      state.slots = state.slots.filter((s) => s.localId !== action.payload)
    },
    clearCompleted(state) {
      state.slots = state.slots.filter((s) => s.status !== 'done')
    },
  },
})

export const uploadTrayActions = uploadTraySlice.actions

export const selectUploadSlots = (state: RootState) => state.uploadTray.slots
export const selectHasActiveUploads = (state: RootState) =>
  state.uploadTray.slots.some(
    (s) => s.status === 'uploading' || s.status === 'confirming',
  )

export const uploadTrayReducer = uploadTraySlice.reducer

export default uploadTraySlice
