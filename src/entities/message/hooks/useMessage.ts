import { useQuery } from '@tanstack/react-query'
import { messageKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { gql } from '@/gql'

const GET_MESSAGE = gql(`
  query GetMessageById($messageId: ID!) {
    getMessageById(messageId: $messageId) {
      ...MessageFields
    }
  }
`)

export function useMessage(messageId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: messageKeys.detail(messageId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_MESSAGE, { messageId })
      return data.getMessageById
    },
    enabled: !!messageId,
  })
}
