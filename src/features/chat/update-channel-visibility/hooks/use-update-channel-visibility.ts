import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UPDATE_CHANNEL_VISIBILITY_MUTATION } from '../api/fragments'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { conversationKeys } from '@/entities/conversation'

export function useUpdateChannelVisibility() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vars: { workspaceId: string; channelId: string; isPublic: boolean }) => {
      const token = await getToken()
      return GqlClient(token).request(UPDATE_CHANNEL_VISIBILITY_MUTATION as any, vars)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(data.updateChannelVisibility.channelId),
      })
      toast.success(`Channel is now ${data.updateChannelVisibility.isPublic ? 'public' : 'private'}`)
    },
    onError: () => {
      toast.error('Failed to update visibility')
    },
  })
}
