import { useQuery } from '@tanstack/react-query'
import { GET_MENTION_EVENTS } from '../api'
import type { MentionEvent } from '@/gql/graphql'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { mentionKeys } from '@/entities/mention'

export function useMentionEvents(mentionId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: mentionKeys.events(mentionId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_MENTION_EVENTS, { mentionId })
      return data.getMentionEvents as Array<MentionEvent>
    },
    enabled: !!mentionId,
  })
}
