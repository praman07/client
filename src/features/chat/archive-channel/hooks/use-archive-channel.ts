import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ARCHIVE_CHANNEL_MUTATION } from '../api'
import { mapArchiveChannelError } from '../lib/error-mapping'
import type { ArchiveChannelInput } from '@/gql/graphql'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { conversationKeys } from '@/entities/conversation'

export function useArchiveChannel() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { workspaceSlug, projectSlug } = useParams({
    from: '/_app/workspace/$workspaceSlug/project/$projectSlug/chat',
  })

  return useMutation({
    mutationFn: async (input: ArchiveChannelInput) => {
      const token = await getToken()
      return GqlClient(token).request(ARCHIVE_CHANNEL_MUTATION, { input })
    },
    onSuccess: (data) => {
      const { workspaceId, projectId, id } = data.archiveChannel

      // 1. Immediately update detail query cache
      queryClient.setQueryData(conversationKeys.detail(id), (oldData: any) => {
        if (!oldData?.getConversation) return oldData
        return {
          ...oldData,
          getConversation: {
            ...oldData.getConversation,
            isArchived: true,
            deletedAt: data.archiveChannel.deletedAt,
          },
        }
      })

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
                  conv.id === id
                    ? {
                        ...conv,
                        isArchived: true,
                        deletedAt: data.archiveChannel.deletedAt,
                      }
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
        queryKey: conversationKeys.detail(id),
      })

      // Show success toast
      toast.success('Channel archived', {
        description: 'The channel has been archived successfully.',
      })

      // Navigate to chat index (no specific conversation)
      navigate({
        to: '/workspace/$workspaceSlug/project/$projectSlug/chat',
        params: { workspaceSlug, projectSlug },
      })
    },
    onError: (error: Error) => {
      const errorMessage = mapArchiveChannelError(error)
      toast.error('Failed to archive channel', {
        description: errorMessage,
      })
    },
  })
}
