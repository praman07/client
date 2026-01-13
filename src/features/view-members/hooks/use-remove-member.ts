import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/shared/auth'
import { createGqlClient } from '@/shared/api/graphql-client'
import { workspaceMemberKeys, REMOVE_MEMBER } from '../api'

export function useRemoveMember(workspaceId: string) {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (variables: { memberId: string }) => {
      const token = await getToken()
      const client = createGqlClient(token)
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
