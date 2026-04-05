import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceKeys } from '@/entities/workspace'
import { authContextKeys } from '@/shared/lib/auth/query-keys'
import { UPDATE_WORKSPACE_ROLE_MUTATION } from '../api/fragments'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { toast } from 'sonner'
import { UpdateWorkspaceRoleInput } from '../model/schema'

export function useUpdateWorkspaceRole(workspaceId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { roleId: string; input: UpdateWorkspaceRoleInput }) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(UPDATE_WORKSPACE_ROLE_MUTATION, {
        workspaceId,
        ...variables,
      })
    },
    onSuccess: () => {
      toast.success('Role updated successfully')
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.roles(workspaceId),
      })
      // Flush auth context so permission guards re-evaluate
      queryClient.invalidateQueries({
        queryKey: authContextKeys.scope(workspaceId, undefined),
      })
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update role')
    },
  })
}
