import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { workspaceMemberKeys, REMOVE_MEMBER } from '../api'

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
      queryClient.invalidateQueries({
        queryKey: workspaceMemberKeys.list(workspaceId),
      })
    },
  })
}
