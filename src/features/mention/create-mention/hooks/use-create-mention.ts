import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CREATE_MENTIONS } from '../api/fragments'
import type { CreateMentionInput, Mention } from '@/gql/graphql'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { mentionKeys } from '@/entities/mention'

export function useCreateMentions() {
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (input: Array<CreateMentionInput>) => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(CREATE_MENTIONS, { mentions: input })
      return data.createMentions as Array<Mention>
    },
  })
}

export function useCreateMentionsWithInvalidation() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Array<CreateMentionInput>) => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(CREATE_MENTIONS, { mentions: input })
      return data.createMentions as Array<Mention>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mentionKeys.all() })
    },
  })
}
