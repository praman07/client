export type SidebarItemType = 'channel' | 'dm'

export interface ChannelItem {
  id: string
  name: string
  type: 'public' | 'private'
  unreadCount?: number
  isMuted?: boolean
}

export interface DMItem {
  id: string
  userId: string
  name: string
  avatarUrl?: string
  status: 'online' | 'offline' | 'away'
  unreadCount?: number
}

export interface SidebarSectionData {
  title: string
  items: (ChannelItem | DMItem)[]
  type: SidebarItemType
}
