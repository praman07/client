import { useQuery } from '@tanstack/react-query'
import { GET_BACKLINKS } from '../api'
import type { BacklinkFilters, BacklinkResult } from '@/gql/graphql'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { mentionKeys } from '@/entities/mention'

export function useBacklinks(
  targetEntityId: string,
  limit = 50,
  filters?: BacklinkFilters
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: [...mentionKeys.backlinks(targetEntityId), { limit, filters }],
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_BACKLINKS, {
        targetEntityId,
        limit,
        filters,
      })
      return data.getBacklinks as BacklinkResult
    },
    enabled: !!targetEntityId,
  })
}
