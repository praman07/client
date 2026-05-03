import { useMutation } from '@tanstack/react-query'
import { UPDATE_MENTION } from '../api'
import type { Mention, UpdateMentionInput } from '@/gql/graphql'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useUpdateMention() {
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (input: UpdateMentionInput) => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(UPDATE_MENTION, { input })
      return data.updateMention as Mention
    },
  })
}
