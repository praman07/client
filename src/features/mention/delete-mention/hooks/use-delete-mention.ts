import { useMutation } from '@tanstack/react-query'
import { DELETE_MENTIONS } from '../api'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useDeleteMentions() {
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (mentionIds: Array<string>) => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(DELETE_MENTIONS, { mentionIds })
      return data.deleteMentions
    },
  })
}
