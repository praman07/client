import { Channel } from '@/entities/channel'
import type { ChannelItem } from '@/widgets/chat-sidebar/model/types'

export function mapChannelsToItems(channels: Channel[]): ChannelItem[] {
  return channels.map((channel) => ({
    id: channel.id,
    name: channel.name || 'Unnamed Channel',
    type: channel.type === 'PRIVATE' ? 'private' : 'public',
  }))
}
