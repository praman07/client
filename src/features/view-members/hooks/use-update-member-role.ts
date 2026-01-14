import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { workspaceMemberKeys, UPDATE_MEMBER_ROLE } from '../api'

export function useUpdateMemberRole(workspaceId: string) {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (variables: { memberId: string; role: string }) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(UPDATE_MEMBER_ROLE, {
        workspaceId,
        ...variables,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceMemberKeys.list(workspaceId),
      })
    },
  })
}
