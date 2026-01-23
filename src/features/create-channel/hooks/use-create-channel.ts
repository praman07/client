import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CREATE_CHANNEL_MUTATION, channelKeys } from '../api'
import type { CreateChannelInput } from '@/gql/graphql'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useCreateChannel() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateChannelInput) => {
      const token = await getToken()
      return GqlClient(token).request(CREATE_CHANNEL_MUTATION, { input })
    },
    onSuccess: (_, variables) => {
      if (variables.projectId) {
        queryClient.invalidateQueries({
          queryKey: channelKeys.byProject(variables.projectId),
        })
      }
      queryClient.invalidateQueries({ queryKey: channelKeys.all })
    },
  })
}
