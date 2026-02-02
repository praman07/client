import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CREATE_CHANNEL_MUTATION } from '../api'
import type { CreateChannelInput } from '@/gql/graphql'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { conversationKeys } from '@/entities/conversation'

export function useCreateChannel() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateChannelInput) => {
      const token = await getToken()
      return GqlClient(token).request(CREATE_CHANNEL_MUTATION, { input })
    },
    onSuccess: (_, variables) => {
      // Invalidate all conversation queries for this workspace/project
      // This ensures the sidebar and other conversation lists update immediately
      const workspaceId = variables.workspaceId
      const projectId = variables.projectId

      if (workspaceId && projectId) {
        // Invalidate all conversations for this workspace/project
        queryClient.invalidateQueries({
          queryKey: conversationKeys.all(workspaceId, projectId),
        })
      }
    },
  })
}
