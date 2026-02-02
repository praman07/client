import { useQuery } from '@tanstack/react-query'
import { GET_CONVERSATION, conversationKeys } from '../api'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetConversationQuery } from '@/gql/graphql'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'

/**
 * Fetch a single conversation by ID (with members)
 *
 * @example
 * const { data } = useConversation('conv_123')
 */
export function useConversation(
  conversationId: string,
  options?: Omit<UseQueryOptions<GetConversationQuery>, 'queryKey' | 'queryFn'>,
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: conversationKeys.detail(conversationId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(GET_CONVERSATION, { conversationId })
    },
    enabled: !!conversationId,
    ...options,
  })
}
