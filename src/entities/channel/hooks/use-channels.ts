import { useQuery } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api'
import { useAuth, useAppDispatch } from '@/shared/hooks'
import { setChannels } from '../model/slice'
import { Channel } from '../model/types'
import { channelKeys, GET_CHANNELS } from '../api'

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
      dispatch(setChannels(data.getUserChannels as Channel[]))

      return data
    },
    enabled: !!workspaceId,
  })
}
