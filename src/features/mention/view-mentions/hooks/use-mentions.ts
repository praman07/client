import { useQuery } from '@tanstack/react-query'
import { GET_MENTIONS } from '../api'
import type { Mention } from '@/gql/graphql'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { mentionKeys } from '@/entities/mention'

export function useMentions(sourceEntityId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: mentionKeys.list(sourceEntityId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_MENTIONS, { sourceEntityId })
      return data.getMentions as Array<Mention>
    },
    enabled: !!sourceEntityId,
  })
}
