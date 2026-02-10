import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import type { UserFragment } from '@/gql/graphql'

const selectUserDomain = (state: RootState) => state.user

export const selectCurrentUser = createSelector(
  selectUserDomain,
  (user): UserFragment | null => user.currentUser,
)
