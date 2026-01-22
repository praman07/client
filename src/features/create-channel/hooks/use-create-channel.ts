import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { ChannelType } from '@/gql/graphql'
import { CREATE_CHANNEL, createChannelKeys } from '../api'
import { channelKeys } from '@/entities/channel'

export function useCreateChannel() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: createChannelKeys.mutation,
    mutationFn: async (input: {
      workspaceId: string
      projectId?: string
      name: string
      topic?: string
      type: 'PUBLIC' | 'PRIVATE' | 'DM'
    }) => {
      const token = await getToken()
      const client = GqlClient(token)

      const channelType =
        input.type === 'PUBLIC'
          ? ChannelType.Public
          : input.type === 'PRIVATE'
            ? ChannelType.Private
            : ChannelType.Dm

      const data = await client.request(CREATE_CHANNEL, {
        input: {
          workspaceId: input.workspaceId,
          projectId: input.projectId,
          name: input.name,
          topic: input.topic,
          type: channelType,
        },
      })
      return data.createChannel
    },
    onSuccess: (newChannel) => {
      // Invalidate channel lists for the workspace
      queryClient.invalidateQueries({
        queryKey: channelKeys.list(newChannel.workspaceId),
      })
    },
  })
}
