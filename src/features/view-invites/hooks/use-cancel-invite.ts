import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CANCEL_WORKSPACE_INVITE, workspaceInviteKeys } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'

/**
 * Revokes (hard-deletes) a workspace invite.
 * Invalidates the invite list on success.
 */
export function useCancelInvite(workspaceId: string) {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (variables: { inviteId: string }) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(CANCEL_WORKSPACE_INVITE, {
        inviteId: variables.inviteId,
        workspaceId,
      })
    },
    onSuccess: () => {
      toast.success('Invitation revoked')
      queryClient.invalidateQueries({
        queryKey: workspaceInviteKeys.list(workspaceId),
      })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to revoke invitation')
    },
  })
}
