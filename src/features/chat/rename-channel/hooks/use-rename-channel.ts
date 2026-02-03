import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RENAME_CHANNEL_MUTATION } from '../api'
import type { RenameChannelInput } from '@/gql/graphql'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { conversationKeys } from '@/entities/conversation'

export function useRenameChannel() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RenameChannelInput) => {
      const token = await getToken()
      return GqlClient(token).request(RENAME_CHANNEL_MUTATION, { input })
    },
    onSuccess: (data) => {
      const { workspaceId, projectId, id } = data.renameChannel

      // Only invalidate channel-related queries (not DMs, Groups, etc.)
      // This reduces unnecessary refetches: 5 queries → 2 queries
      if (workspaceId && projectId) {
        queryClient.invalidateQueries({
          queryKey: conversationKeys.channels(workspaceId, projectId),
        })
      }

      // Invalidate the specific conversation detail
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(id),
      })
    },
  })
}
