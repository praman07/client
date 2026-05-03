import { useQuery } from '@tanstack/react-query'
import { GET_ALL_PERMISSIONS_QUERY } from '../api/fragments'
import { rolePermissionKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function usePermissionsCatalog(workspaceId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: rolePermissionKeys.catalog(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_ALL_PERMISSIONS_QUERY, { workspaceId })
      return data.allPermissions
    },
    enabled: !!workspaceId,
    staleTime: 10 * 60 * 1000,
  })
}
