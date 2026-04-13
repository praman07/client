import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ADD_CHANNEL_MEMBERS_MUTATION, REMOVE_CHANNEL_MEMBER_MUTATION } from '../api/fragments'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { conversationKeys } from '@/entities/conversation'

export function useAddChannelMembers(channelId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vars: { workspaceId: string; userIds: Array<string> }) => {
      const token = await getToken()
      return GqlClient(token).request(ADD_CHANNEL_MEMBERS_MUTATION as any, {
        workspaceId: vars.workspaceId,
        channelId,
        userIds: vars.userIds,
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(channelId) })
      toast.success(`Added ${data.addChannelMembers.addedCount} member${data.addChannelMembers.addedCount !== 1 ? 's' : ''}`)
    },
    onError: () => {
      toast.error('Failed to add members')
    },
  })
}

export function useRemoveChannelMember(channelId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vars: { workspaceId: string; userId: string }) => {
      const token = await getToken()
      return GqlClient(token).request(REMOVE_CHANNEL_MEMBER_MUTATION as any, {
        workspaceId: vars.workspaceId,
        channelId,
        userId: vars.userId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(channelId) })
      toast.success('Member removed')
    },
    onError: () => {
      toast.error('Failed to remove member')
    },
  })
}
