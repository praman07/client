import { channelSettingsActions } from '../model/slice'
import type { RootState } from '@/app/store'
import type { ChannelSettingsTab } from '../model/types'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'

export function useChannelSettings() {
  const dispatch = useAppDispatch()
  const { isOpen, channelId, activeTab } = useAppSelector(
    (state: RootState) => state.channelSettings,
  )

  return {
    isOpen,
    channelId,
    activeTab,
    open: (id: string) => dispatch(channelSettingsActions.open(id)),
    close: () => dispatch(channelSettingsActions.close()),
    setTab: (tab: ChannelSettingsTab) =>
      dispatch(channelSettingsActions.setActiveTab(tab)),
  }
}
