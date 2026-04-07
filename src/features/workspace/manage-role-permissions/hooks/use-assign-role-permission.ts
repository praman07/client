import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ASSIGN_ROLE_PERMISSION_MUTATION } from '../api/fragments'
import { rolePermissionKeys } from '../api/query-keys'
import { authContextKeys } from '@/shared/lib/auth/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useAssignRolePermission(workspaceId: string, roleId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { permissionId: string; effect?: string; conditions?: string }) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(ASSIGN_ROLE_PERMISSION_MUTATION, {
        workspaceId,
        roleId,
        ...variables,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolePermissionKeys.byRole(workspaceId, roleId),
      })
      queryClient.invalidateQueries({
        queryKey: rolePermissionKeys.workspaceCatalog(workspaceId),
      })
      // Flush auth context so permission guards re-evaluate
      queryClient.invalidateQueries({
        queryKey: authContextKeys.scope(workspaceId, undefined),
      })
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to assign permission')
    },
  })
}
