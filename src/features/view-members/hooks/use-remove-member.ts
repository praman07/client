import { useMutation, useQueryClient } from '@tanstack/react-query'
import { REMOVE_MEMBER, workspaceMemberKeys } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'
import { toast } from 'sonner'

export function useRemoveMember(workspaceId: string) {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (variables: { memberId: string }) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(REMOVE_MEMBER, {
        workspaceId,
        memberId: variables.memberId,
      })
    },
    onSuccess: () => {
      toast.success('Member removed')
      queryClient.invalidateQueries({
        queryKey: workspaceMemberKeys.list(workspaceId),
      })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to remove member')
    },
  })
}
