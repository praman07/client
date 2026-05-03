import { useQuery } from '@tanstack/react-query'
import { GET_ROLE_PERMISSIONS_QUERY } from '../api/fragments'
import { rolePermissionKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useRolePermissions(workspaceId: string, roleId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: rolePermissionKeys.byRole(workspaceId, roleId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_ROLE_PERMISSIONS_QUERY, { workspaceId, roleId })
      return data.rolePermissions
    },
    enabled: !!workspaceId && !!roleId,
    staleTime: 2 * 60 * 1000,
  })
}
