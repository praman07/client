import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UserFragment } from '@/gql/graphql'

interface UserState {
  currentUser: UserFragment | null
}

const initialState: UserState = {
  currentUser: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserFragment | null>) => {
      // Create a plain object copy if needed to avoid non-serializable issues,
      // but Fragments are usually JSON-safe.
      state.currentUser = action.payload
    },
    updateCurrentUser: (
      state,
      action: PayloadAction<Partial<UserFragment>>,
    ) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
      }
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
  },
})

export const { setCurrentUser, updateCurrentUser, clearCurrentUser } =
  userSlice.actions
export default userSlice.reducer
