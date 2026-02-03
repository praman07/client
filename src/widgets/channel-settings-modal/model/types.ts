export enum ChannelSettingsTab {
  ABOUT = 'about',
  MEMBERS = 'members',
  SETTINGS = 'settings',
}

export interface ChannelSettingsState {
  isOpen: boolean
  channelId: string | null
  activeTab: ChannelSettingsTab
}
