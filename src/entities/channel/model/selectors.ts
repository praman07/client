import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store' // Assuming this exists or will exist

// @ts-ignore - RootState might not have channel field yet until registered
const selectChannelDomain = (state: RootState) => state.channel

export const selectAllChannels = createSelector(selectChannelDomain, (state) =>
  Object.values(state?.channels ?? {}),
)

export const selectChannelById = (id: string) =>
  createSelector(selectChannelDomain, (state) => state?.channels?.[id])

export const selectActiveChannelId = createSelector(
  selectChannelDomain,
  (state) => state?.activeChannelId,
)
