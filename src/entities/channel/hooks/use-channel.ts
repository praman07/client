import { useQuery } from '@tanstack/react-query'
import { channelKeys } from '../api'

export function useChannel(channelId: string) {
  // Disabled until backend supports getChannelById or similar
  return useQuery({
    queryKey: channelKeys.detail(channelId),
    queryFn: async () => {
      // Backend does not support getChannel yet
      return null
    },
    enabled: false,
  })
}
