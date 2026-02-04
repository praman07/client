import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { DELETE_CHANNEL_MUTATION } from '../api'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { conversationKeys } from '@/entities/conversation'
import { toast } from 'sonner'
import { mapDeleteChannelError } from '../lib/error-mapping'

interface DeleteChannelInput {
  workspaceId: string
  projectId?: string
  channelId: string
}

export function useDeleteChannel() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { workspaceSlug, projectSlug } = useParams({
    from: '/_app/workspace/$workspaceSlug/project/$projectSlug/chat',
  })

  return useMutation({
    mutationFn: async (input: DeleteChannelInput) => {
      const token = await getToken()
      return GqlClient(token).request(DELETE_CHANNEL_MUTATION, {
        workspaceId: input.workspaceId,
        channelId: input.channelId,
      })
    },
    onSuccess: (_, variables) => {
      const { channelId, workspaceId, projectId } = variables

      // 1. Immediately remove from detail query cache
      queryClient.removeQueries({
        queryKey: conversationKeys.detail(channelId),
      })

      // 2. Immediately remove from channels list cache (for sidebar)
      if (workspaceId && projectId) {
        queryClient.setQueryData(
          conversationKeys.channels(workspaceId, projectId),
          (oldData: any) => {
            if (!oldData?.getUserConversations?.edges) return oldData
            return {
              ...oldData,
              getUserConversations: {
                ...oldData.getUserConversations,
                edges: oldData.getUserConversations.edges.filter(
                  (conv: any) => conv.id !== channelId,
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

      // Show success toast
      toast.success('Channel deleted', {
        description: 'The channel has been permanently deleted.',
      })

      // Navigate to chat index (no specific conversation)
      navigate({
        to: '/workspace/$workspaceSlug/project/$projectSlug/chat',
        params: { workspaceSlug, projectSlug },
      })
    },
    onError: (error: Error) => {
      const errorMessage = mapDeleteChannelError(error)
      toast.error('Failed to delete channel', {
        description: errorMessage,
      })
    },
  })
}
