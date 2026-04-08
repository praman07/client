import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UPDATE_CHANNEL_DESCRIPTION_MUTATION } from '../api/fragments'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { conversationKeys } from '@/entities/conversation'

export function useUpdateChannelDescription() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vars: { workspaceId: string; channelId: string; description: string | null }) => {
      const token = await getToken()
      return GqlClient(token).request(UPDATE_CHANNEL_DESCRIPTION_MUTATION as any, {
        workspaceId: vars.workspaceId,
        channelId: vars.channelId,
        description: vars.description,
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(data.updateChannelDescription.channelId),
      })
      toast.success('Description updated')
    },
    onError: () => {
      toast.error('Failed to update description')
    },
  })
}
