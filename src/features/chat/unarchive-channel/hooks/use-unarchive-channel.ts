import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UNARCHIVE_CHANNEL_MUTATION } from '../api'
import { mapUnarchiveChannelError } from '../lib/error-mapping'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { conversationKeys } from '@/entities/conversation'

interface UnarchiveChannelInput {
  workspaceId: string
  projectId?: string
  channelId: string
}

export function useUnarchiveChannel() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UnarchiveChannelInput) => {
      const token = await getToken()
      return GqlClient(token).request(UNARCHIVE_CHANNEL_MUTATION, {
        workspaceId: input.workspaceId,
        channelId: input.channelId,
      })
    },
    onSuccess: (_, variables) => {
      const { channelId, workspaceId, projectId } = variables

      // 1. Immediately update detail query cache
      queryClient.setQueryData(
        conversationKeys.detail(channelId),
        (oldData: any) => {
          if (!oldData?.getConversation) return oldData
          return {
            ...oldData,
            getConversation: {
              ...oldData.getConversation,
              isArchived: false,
              deletedAt: null,
            },
          }
        },
      )

      // 2. Immediately update channels list cache (for sidebar)
      if (workspaceId && projectId) {
        queryClient.setQueryData(
          conversationKeys.channels(workspaceId, projectId),
          (oldData: any) => {
            if (!oldData?.getUserConversations?.edges) return oldData
            return {
              ...oldData,
              getUserConversations: {
                ...oldData.getUserConversations,
                edges: oldData.getUserConversations.edges.map((conv: any) =>
                  conv.id === channelId
                    ? { ...conv, isArchived: false, deletedAt: null }
                    : conv,
                ),
              },
            }
          },
        )
      }

      // 3. Invalidate queries for background refetch
      if (workspaceId && projectId) {
        queryClient.invalidateQueries({
          queryKey: conversationKeys.channels(workspaceId, projectId),
        })
      }

      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(channelId),
      })

      // Show success toast
      toast.success('Channel unarchived', {
        description: 'The channel has been restored successfully.',
      })
    },
    onError: (error: Error) => {
      const errorMessage = mapUnarchiveChannelError(error)
      toast.error('Failed to unarchive channel', {
        description: errorMessage,
      })
    },
  })
}
