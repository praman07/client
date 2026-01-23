import { useQuery } from '@tanstack/react-query'
import { setChannels } from '../model/slice'
import { GET_CHANNELS, channelKeys } from '../api'
import type { Channel } from '../model/types'
import { useAppDispatch, useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'

export function useChannels(workspaceId: string) {
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: channelKeys.list(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      // GqlClient factory handles null token if needed, or we can throw
      const client = GqlClient(token)

      const data = await client.request(GET_CHANNELS, { workspaceId })

      // Dispatch to Redux Store
      dispatch(setChannels(data.getUserChannels as Array<Channel>))

      return data
    },
    enabled: !!workspaceId,
  })
}
