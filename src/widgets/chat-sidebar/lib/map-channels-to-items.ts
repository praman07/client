import type { ChannelItem } from '@/widgets/chat-sidebar/model/types'
import type { Channel } from '@/entities/channel'

export function mapChannelsToItems(channels: Array<Channel>): Array<ChannelItem> {
  return channels.map((channel) => ({
    id: channel.id,
    name: channel.name || 'Unnamed Channel',
    type: channel.type === 'PRIVATE' ? 'private' : 'public',
  }))
}
