import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

const selectChatSessionDomain = (state: RootState) => state.chatSession

export const selectGlobalConnectionState = createSelector(
  selectChatSessionDomain,
  (session) => session.globalConnectionState,
)

export const selectChannelSession = (channelId: string) =>
  createSelector(
    selectChatSessionDomain,
    (session) => session.sessions[channelId],
  )

export const selectChannelStatus = (channelId: string) =>
  createSelector(
    selectChannelSession(channelId),
    (session) => session?.status ?? 'OFFLINE',
  )

export const selectIsRecovering = (channelId: string) =>
  createSelector(
    selectChannelStatus(channelId),
    (status) => status === 'RECOVERING',
  )
