import { useMutation } from '@tanstack/react-query'
import { DELETE_MENTIONS_BY_SOURCE } from '../api'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useDeleteMentionsBySource() {
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (sourceEntityId: string) => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(DELETE_MENTIONS_BY_SOURCE, { sourceEntityId })
      return data.deleteMentionsBySource
    },
  })
}
