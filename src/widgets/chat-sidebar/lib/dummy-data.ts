import { ChannelItem, DMItem } from '../model/types'

export const DUMMY_CHANNELS: ChannelItem[] = Array.from({ length: 50 }).map(
  (_, i) => ({
    id: `channel-${i}`,
    name: `channel-${i + 1}`,
    type: i % 3 === 0 ? 'private' : 'public',
    unreadCount: i % 5 === 0 ? 3 : 0,
  }),
)

export const DUMMY_DMS: DMItem[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `dm-${i}`,
  userId: `user-${i}`,
  name: `User ${i + 1}`,
  status: i % 4 === 0 ? 'online' : i % 4 === 1 ? 'away' : 'offline',
  unreadCount: i % 10 === 0 ? 1 : 0,
}))
