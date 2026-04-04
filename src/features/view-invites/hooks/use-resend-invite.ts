import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RESEND_WORKSPACE_INVITE, workspaceInviteKeys } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'
import { toast } from 'sonner'

/**
 * Resends a workspace invite, extending its expiry by +7 days.
 * Invalidates the invite list on success to reflect updated expiresAt.
 */
export function useResendInvite(workspaceId: string) {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (variables: { inviteId: string }) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(RESEND_WORKSPACE_INVITE, {
        inviteId: variables.inviteId,
        workspaceId,
      })
    },
    onSuccess: () => {
      toast.success('Invitation resent — expiry extended by 7 days')
      queryClient.invalidateQueries({
        queryKey: workspaceInviteKeys.list(workspaceId),
      })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to resend invitation')
    },
  })
}
