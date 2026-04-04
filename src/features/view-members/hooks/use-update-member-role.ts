import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UPDATE_MEMBER_ROLE, workspaceMemberKeys } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'
import { authContextKeys } from '@/shared/lib/auth/query-keys'
import { toast } from 'sonner'

export function useUpdateMemberRole(workspaceId: string) {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (variables: { memberId: string; roleId: string }) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(UPDATE_MEMBER_ROLE, {
        workspaceId,
        ...variables,
      })
    },
    onSuccess: () => {
      toast.success('Role updated successfully')
      // Refresh member list
      queryClient.invalidateQueries({
        queryKey: workspaceMemberKeys.list(workspaceId),
      })
      // Refresh auth context so Guard re-evaluates if current user's role changed
      queryClient.invalidateQueries({
        queryKey: authContextKeys.scope(workspaceId, undefined),
      })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update role')
    },
  })
}

