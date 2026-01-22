import { RootState } from '@/app/store'
import { createSelector } from '@reduxjs/toolkit'

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
